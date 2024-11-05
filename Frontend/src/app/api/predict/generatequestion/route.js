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
                    content: `You are a specialized mental health question generator focused on progression and uniqueness. Your role is to:

                        1. Generate unique, non-repetitive assessment questions that:
                        - Build on previous session data
                        - Avoid repeating historical questions
                        - Support treatment progression
                        - Maintain therapeutic alignment

                        2. Use comprehensive knowledge of:
                        - Mental health assessment methods
                        - Treatment progression patterns
                        - Question evolution techniques
                        - Context-aware interviewing
                        - Dynamic assessment strategies
                        - Trauma-informed practices
                        - Cultural competency principles

                        3. Ensure each question:
                        - Advances therapeutic goals
                        - Builds on previous responses
                        - Maintains clinical relevance
                        - Considers cultural context
                        - Follows trauma-informed guidelines

                        4. Actively avoid:
                        - Repeating previous questions
                        - Similar thematic inquiries
                        - Redundant assessment areas
                        - Non-progressive questioning
`
                },
                {
                    role: "user",
                    content: `
                   Generate 10 unique mental health assessment questions based on:

                    1. Previous Session Summary:
                    ${JSON.stringify(latestQA.summary)}

                    2. Previous Questions to Avoid:
                    ${JSON.stringify(latestQA.question[0])}


                    3. Response Format as json:
                   {
                        "questions": [
                            {
                                "category": "[DOMAIN]",
                                "question_type": "open|closed",
                                "question": "[QUESTION]"
                            }
                        ]
                    }

                    4. Requirements:
                    - Questions must progress from general to specific
                    - Include at least one question from each major domain
                    - Align with previous session concerns
                    - Consider cultural and trauma sensitivity
                    - Connect to treatment goals
                    - Maintain professional and empathetic tone
                    - Must not repeat questions from previous sessions
                    - Should build upon previous responses

                    
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
