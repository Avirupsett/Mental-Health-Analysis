import { NextResponse } from 'next/server';
import UserResponses from '../../../../models/userAnalytics';
import UserInfo from '../../../../models/userInfo';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import Progress from '../../../../models/progress';
import qaAssignment from '../../../../models/qaAssignment';
import Groq from 'groq-sdk';

const BACKEND_URL = process.env.BACKEND_URL;
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
    await connectDB();
    const { user } = await getUser();

    //Find the question and Save the answer to the qaAssignment collection
    const existingQaAssignment = await qaAssignment.findOne()
        .where({ user_id: user.id, answer: { $size: 0 } })
        .sort({ created_at: -1 })
        .lean();

    let data = await req.json()


    const enhancedData = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are an expert answer completion assistant specializing in mental health responses. Your role is to:

                1. Core Functions:
                - Analyze question-answer alignment
                - Maintain original context and meaning

                2. Completion Process:
                - Map question components
                - Keep it short in one line and simple

                3. Quality Standards:
                - Answer completeness`
            },
            {
                role: "user",
                content: `Analyze and complete the following mental health Q&A:

                Original Questions:  ${JSON.stringify(existingQaAssignment.question)}

                Original Answers: ${JSON.stringify(data)}

                Complete the answer by:

                1. Question Analysis:
                - Identify main question components

                2. Answer Evaluation:
                - Check completeness
                - Verify relevance

                3. Completion Requirements:
                - Keep original meaning
                - Use consistent language


                Format response in json as:
                {
                    "enhancedAnswer": [
                         {"1": "enhanced response for question 1"},
                        {"2": "enhanced response for question 2"},
                        // ... continue for all questions
                    ]
                }

                Ensure the enhanced answer:
                1. Preserves original meaning
                2. Keep it short in one line and simple.
                3. Don't add extra text or assume anything which is not there in original answer`
            }
        ],
        model: "llama3-groq-70b-8192-tool-use-preview",
        temperature: 0,
        response_format: { type: "json_object" }
    });

    const enhancedAnswer = JSON.parse(enhancedData.choices[0]?.message?.content);

    try {

        const response = await fetch(`${BACKEND_URL}/sentimentmodel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedAnswer.enhancedAnswer),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Update progress
        let progress = await Progress.findOne({ user_id: user.id });

        let warning_type = 0;
        if (result) {
            const userResponse = new UserResponses({
                user_id: user.id,
                analysis_result:
                    { "Stress Level": parseFloat(result["Stress Level"]) },
            });
            await userResponse.save();
            if (parseFloat(result["Stress Level"]) >= process.env.STRESS_LEVEL_THRESHOLD) {
                warning_type = 1;
            }


            if (existingQaAssignment) {
                // Convert enhanced answers array to object format
                const formattedAnswers = enhancedAnswer.enhancedAnswer.reduce((obj, item) => {
                    const key = Object.keys(item)[0];
                    obj[key] = item[key];
                    return obj;
                }, {});

                await qaAssignment.findByIdAndUpdate(existingQaAssignment._id, { $set: { answer: [data], enhanced_answer: [formattedAnswers] } });
            }


            if (!progress) {
                const newProgress = new Progress({
                    user_id: user.id,
                    pending_assignments: process.env.MAX_ASSIGNMENT - 1,
                    next_assignment_date: new Date(Date.now()),
                    warning_type: warning_type
                });
                await newProgress.save();
            }
            else {

                if (progress.pending_assignments - 1 > 0) {
                    const updatedProgress = await Progress.findOneAndUpdate(
                        { user_id: user.id },
                        { $set: { pending_assignments: progress.pending_assignments - 1, warning_type:(progress.warning_type==1 && warning_type==0) ? 0 : (progress.warning_type + warning_type) > 1 ? 0 : progress.warning_type + warning_type } },
                        { new: true }
                    );
                    await updatedProgress.save();
                }
                else if (progress.pending_assignments - 1 == 0) {
                    const updatedProgress = await Progress.findOneAndUpdate(
                        { user_id: user.id },
                        {
                            $set: {
                                next_assignment_date: new Date(Date.now() + process.env.ASSIGNMENT_INTERVAL * 1000) > new Date(new Date().setHours(0, 0, 0, 0) + 86400 * 1000) ? new Date(new Date().setHours(0, 0, 0, 0) + process.env.ASSIGNMENT_INTERVAL * 1000) : new Date(Date.now() + process.env.ASSIGNMENT_INTERVAL * 1000),
                                pending_assignments: process.env.MAX_ASSIGNMENT,
                                warning_type: (progress.warning_type==1 && warning_type==0) ? 0 : (progress.warning_type + warning_type) > 1 ? 0 : progress.warning_type + warning_type
                            }
                        },
                        { new: true }
                    );
                    await updatedProgress.save();
                }
            }

        }
        return NextResponse.json({ ...result, warning_type: !progress ? warning_type : progress.warning_type + warning_type }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }


}