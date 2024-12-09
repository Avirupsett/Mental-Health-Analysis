import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import connectDB from '../../../../lib/connectDB';
import { getUser } from '@workos-inc/authkit-nextjs';
import qaAssignment from '../../../../models/qaAssignment';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
    try {
        
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

        if (!enhancedAnswer) {
            return NextResponse.json({ error: "Failed to enhance answer" }, { status: 500 });
        }


        return NextResponse.json( enhancedAnswer );

    } catch (error) {
        console.error("Error enhancing answer:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
