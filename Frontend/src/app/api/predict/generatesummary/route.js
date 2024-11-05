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

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        // Connect to database
        await connectDB();

        // Get the latest question and answer from QAAssignment
        const latestQA = await QAAssignment.findOne()
            .where('user_id', user.id)
            .sort({ created_at: -1 }) // Sort by createdAt in descending order
            .lean(); // Convert to plain JavaScript object.


        if (!latestQA) {
            return NextResponse.json({ error: "No questions found" }, { status: 404 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a specialized mental health analysis assistant utilizing a comprehensive biopsychosocial approach. Your role is to:

                        1. Core Analysis Functions:
                        - Extract and categorize critical health information
                        - Assess multiple domains of functioning
                        - Identify risks and protective factors
                        - Generate domain-specific insights
                        - Maintain clinical continuity
                        - Ensure confidentiality

                        2. Domain-Specific Analysis:
                        
                        A. Biological Domain
                        - Evaluate physical health patterns
                        - Assess sleep and dietary habits
                        - Monitor medication effectiveness
                        - Track exercise routines
                        - Note genetic considerations

                        B. Psychological Domain
                        - Analyze mental state changes
                        - Evaluate cognitive patterns
                        - Track self-perception shifts
                        - Monitor coping strategy effectiveness
                        - Assess addiction risks

                        C. Social Domain
                        - Evaluate family dynamics
                        - Assess work/school functioning
                        - Monitor financial stability
                        - Track housing situation
                        - Evaluate support systems

                        D. Trauma & Stress
                        - Identify recent stressors
                        - Monitor trauma responses
                        - Track coping resources
                        - Assess stress management

                        E. Identity & Culture
                        - Consider cultural influences
                        - Note gender/orientation factors
                        - Track discrimination experiences
                        - Assess spiritual/religious aspects

                        F. Historical Context
                        - Consider childhood influences
                        - Track treatment history
                        - Note family health patterns
                        - Monitor life event impacts

                        3. Analysis Guidelines:
                        - Prioritize explicit symptoms and concerns
                        - Document safety risks and crisis indicators
                        - Track intervention effectiveness
                        - Note progress markers and setbacks
                        - Consider cultural context in all domains
                        - Maintain therapeutic alignment

`
                },
                {
                    role: "user",
                    content: `
                    Analyze the following mental health discussion using a comprehensive biopsychosocial framework:

                    Question: ${latestQA.question[0]}
                    Answer: ${latestQA.answer[0]}

                    Provide a structured analysis covering:

                    1. Core Issues Analysis:
                    - Primary concerns across all domains
                    - Secondary issues and their interactions
                    - Risk factors by domain
                    - Protective factors identified

                    2. Biopsychosocial Assessment:
                    
                    A. Biological Domain
                    - Physical health status
                    - Sleep patterns
                    - Diet and exercise
                    - Medication effectiveness
                    - Genetic considerations

                    B. Psychological Domain
                    - Mental state evaluation
                    - Cognitive functioning
                    - Self-perception
                    - Coping mechanisms
                    - Addiction patterns

                    C. Social Domain
                    - Family system dynamics
                    - Occupational functioning
                    - Financial situation
                    - Housing stability
                    - Support network

                    D. Trauma & Stress Factors
                    - Current stressors
                    - Trauma impacts
                    - Coping resources
                    - Stress management

                    E. Identity & Cultural Considerations
                    - Cultural influences
                    - Gender/orientation factors
                    - Religious/spiritual aspects
                    - Discrimination experiences

                    F. Historical Context
                    - Relevant childhood factors
                    - Family mental health history
                    - Treatment history
                    - Significant life events

                    3. Progress Tracking:
                    - Domain-specific changes
                    - Strategy effectiveness
                    - New symptoms or improvements
                    - Resource utilization

                    4. Action Planning:
                    - Domain-specific interventions
                    - Resource recommendations
                    - Skill development needs
                    - Support system engagement

                    Format response in json as:
                    {
                        "core_concerns": {
                            "primary": "",
                            "secondary": [],
                            "risk_level": "low|medium|high",
                            "domain_specific_risks": {
                                "biological": [],
                                "psychological": [],
                                "social": [],
                                "trauma": [],
                                "identity": [],
                                "historical": []
                            }
                        },
                        "progress": {
                            "improvements": {
                                "biological": [],
                                "psychological": [],
                                "social": [],
                                "trauma": [],
                                "identity": [],
                                "historical": []
                            },
                            "challenges": {
                                "biological": [],
                                "psychological": [],
                                "social": [],
                                "trauma": [],
                                "identity": [],
                                "historical": []
                            },
                            "strategy_effectiveness": {}
                        },
                        "action_items": {
                            "immediate": {
                                "biological": [],
                                "psychological": [],
                                "social": [],
                                "other": []
                            },
                            "short_term": [],
                            "resources": []
                        },
                        "follow_up": {
                            "recommended_timing": "",
                            "focus_areas": [],
                            "goals": {
                                "biological": [],
                                "psychological": [],
                                "social": [],
                                "other": []
                            }
                        },
                        "continuity_notes": "",
                        "crisis_indicators": {
                            "present": false,
                            "domains_affected": [],
                            "severity": "none|low|medium|high"
                        }
                    }
                    `
                }
            ],
            model: "llama3-groq-70b-8192-tool-use-preview",
            temperature: 1,
            //   max_tokens: 200,
            response_format: { type: "json_object" }
        });

        const summary = JSON.parse(completion.choices[0]?.message?.content);

        if (!summary) {
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
        }

        // Update the latest QA with summary
        await QAAssignment.findByIdAndUpdate(latestQA._id, { summary: summary });

        return NextResponse.json(summary);

    } catch (error) {
        console.error("Error generating summary:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
