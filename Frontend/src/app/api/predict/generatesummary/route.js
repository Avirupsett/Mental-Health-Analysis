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
                        - Extract and categorize critical health information based strictly on provided data
                        - Assess multiple domains of functioning using only the given information
                        - Identify risks and protective factors without assuming or hallucinating
                        - Generate domain-specific insights based on the question and answer
                        - Maintain clinical continuity
                        - Ensure confidentiality

                        2. Domain-Specific Analysis:

                        A. Physical Health Domain
                        - Evaluate current physical symptoms and conditions
                        - Track chronic health conditions if present
                        - Monitor pain levels and patterns
                        - Assess physical limitations or disabilities
                        - Note recent health changes or concerns
                        
                        B. Biological Domain
                        - Assess sleep and dietary habits as mentioned
                        - Monitor medication effectiveness if discussed
                        - Track exercise routines if applicable
                        - Note genetic considerations if provided

                        C. Psychological Domain
                        - Analyze mental state changes based on the answer
                        - Evaluate cognitive patterns as described
                        - Track self-perception shifts if mentioned
                        - Monitor coping strategy effectiveness from the data
                        - Assess addiction risks if indicated

                        D. Social Domain
                        - Evaluate family dynamics from the given context
                        - Assess work/school functioning as described
                        - Monitor financial stability if mentioned
                        - Track housing situation if applicable
                        - Evaluate support systems based on the answer

                        E. Trauma & Stress
                        - Identify recent stressors from the provided information
                        - Monitor trauma responses as described
                        - Track coping resources if mentioned
                        - Assess stress management based on the data

                        F. Identity & Culture
                        - Consider cultural influences if provided
                        - Note gender/orientation factors if mentioned
                        - Track discrimination experiences if applicable
                        - Assess spiritual/religious aspects if discussed

                        G. Historical Context
                        - Consider childhood influences if provided
                        - Track treatment history as mentioned
                        - Note family health patterns if applicable
                        - Monitor life event impacts based on the data

                        3. Analysis Guidelines:
                        - Prioritize explicit symptoms and concerns from the provided data
                        - Document safety risks and crisis indicators if mentioned
                        - Track intervention effectiveness based on the answer
                        - Note progress markers and setbacks as described
                        - Consider cultural context in all domains if provided
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

                    A. Physical Health Domain
                    - Current physical symptoms
                    - Chronic conditions
                    - Pain assessment
                    - Physical limitations
                    - Recent health changes
                    
                    B. Biological Domain
                    - Sleep patterns
                    - Diet and exercise
                    - Medication effectiveness
                    - Genetic considerations

                    C. Psychological Domain
                    - Mental state evaluation
                    - Cognitive functioning
                    - Self-perception
                    - Coping mechanisms
                    - Addiction patterns

                    D. Social Domain
                    - Family system dynamics
                    - Occupational functioning
                    - Financial situation
                    - Housing stability
                    - Support network

                    E. Trauma & Stress Factors
                    - Current stressors
                    - Trauma impacts
                    - Coping resources
                    - Stress management

                    F. Identity & Cultural Considerations
                    - Cultural influences
                    - Gender/orientation factors
                    - Religious/spiritual aspects
                    - Discrimination experiences

                    G. Historical Context
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
                                "physical": [],
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
                                "physical": [],
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
                                "physical": [],
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
                                "physical": [],
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
            temperature: 0.7,
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
