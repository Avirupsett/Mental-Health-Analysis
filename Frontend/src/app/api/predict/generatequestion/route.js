import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import QAAssignment from '../../../../models/qaAssignment';
import connectDB from '../../../../lib/connectDB';
import { getUser } from '@workos-inc/authkit-nextjs';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
    try {
        const { user } = await getUser();

         // Add user authentication check
         if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        // Connect to database
        await connectDB();

        // Get the latest question and answer from QAAssignment
        const latestQA = await QAAssignment.findOne()
            .where('user_id', user.id)
            .sort({ created_at: -1 })
            .lean(); // Convert to plain JavaScript object


        if (!latestQA) {
            return NextResponse.json({ error: "No previous summary found" }, { status: 404 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an empathetic mental health question generator. Your role is to:

                1. Generate thoughtful questions that:
                - Help understand the person's overall well-being
                - Consider their previous responses
                - Are easy to understand and answer
                - Feel natural and conversational

                2. Focus on:
                - Understanding the whole person
                - Building trust and rapport
                - Being sensitive to personal circumstances
                - Following up on previous concerns when relevant

                3. Create questions that:
                - Are clear and straightforward
                - Feel supportive and non-judgmental
                - Help explore both challenges and strengths
                - Consider the person's comfort level`
                },
                {
                    role: "user",
                    content: `
                   Generate 10 supportive mental health questions based on:

                    1. Previous Session Summary:
                    ${JSON.stringify(latestQA.summary.core_concerns)}

                    2. Previous Questions to Avoid:
                    ${JSON.stringify(latestQA.question[0])}


                    3. Response Format as json:
                   {
                        "questions": [
                            {
                                "category": "[AREA_OF_FOCUS]",
                                "question_type": "open|closed",
                                "question": "[QUESTION]"
                            }
                        ]
                    }

                    4. Guidelines:
                    - Mix general well-being questions with specific follow-ups
                    - Use simple, clear language
                    - Be naturally conversational
                    - Show empathy and understanding
                    - Build on previous responses when relevant
                    - Avoid repeating previous questions
                    
                    Generate questions and format them as a single JSON object containing an array of questions.
                    `
                }
            ],
            model: "llama3-groq-70b-8192-tool-use-preview",
            temperature: 1,
            //   max_tokens: 200,
            response_format: { type: "json_object" }
        });

        const question =  JSON.parse(completion.choices[0]?.message?.content);

        if (!question) {
            return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
        }


        // Save question to database
        const newQuestion = new QAAssignment({
            user_id: user.id,
            question: Object.fromEntries(
                question.questions.map((q, index) => [
                    (index + 1).toString(),
                    q.question
                ])
            ),
        });

        await newQuestion.save();

        return NextResponse.json( question );

    } catch (error) {
        console.error("Error generating question:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
