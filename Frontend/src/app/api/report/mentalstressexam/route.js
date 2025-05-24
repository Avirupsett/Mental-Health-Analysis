import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import UserResponses from '../../../../models/userAnalytics';
import qaAssignment from '../../../../models/qaAssignment';
// import Groq from 'groq-sdk';

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

export async function POST(req) {
    try {
        const { user } = await getUser();
        const userId = user.id;
        await connectDB();
        const body = await req.json()
        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);

        const LatestUserResponses = await UserResponses.find({ user_id: userId }).sort({ created_at: -1 }).limit(1);
        const FirstqaAssignment = await qaAssignment.find({ user_id: userId }).sort({ created_at: 1 }).limit(1);
        const occupation = FirstqaAssignment[0].answer[0]['1'] || "N/A";
        const familyHistory = FirstqaAssignment[0].answer[0]['2'] || "N/A";
        const moodSwings = FirstqaAssignment[0].answer[0]['7'] || "N/A";
        const copingStruggles = FirstqaAssignment[0].answer[0]['8'] || "N/A";
        const workInterest = FirstqaAssignment[0].answer[0]['9'] || "N/A";
        const socialWeakness = FirstqaAssignment[0].answer[0]['10'] || "N/A";
        const medicalHistory = FirstqaAssignment[0].answer[0]['3'] || "N/A";
        const personalHistory = FirstqaAssignment[0].answer[0]['5'] || "N/A";
        const userResponsesBasedOnDate = await UserResponses.find({ user_id: userId, created_at: { $gte: startDate, $lte: endDate } });
        const qaAssignmentBasedOnDate = await qaAssignment.find({ user_id: userId, created_at: { $gte: startDate, $lte: endDate } }).sort({ created_at: -1 }).limit(2);

        const randomdata = await qaAssignment.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    user_id: userId
                }
            },
            {
                $addFields: {
                    week: { $isoWeek: '$created_at' },
                    year: { $isoWeekYear: '$created_at' }
                }
            },
            {
                $group: {
                    _id: { year: '$year', week: '$week' },
                    docs: { $push: '$$ROOT' },
                    count: { $sum: 1 }
                }
            },
            {
                $match: { count: { $gte: 1 } }
            },
            {
                $addFields: { rand: { $rand: {} } }
            },
            {
                $sort: { rand: 1 }
            },
            {
                $limit: 1
            },
            {
                $project: { docs: { $slice: ['$docs', 10] } }
            },
            {
                $unwind: '$docs'
            },
            {
                $replaceRoot: { newRoot: '$docs' }
            },
            {
                $project: { summary: 1, created_at: 1 }
            }
        ]);



        if (userResponsesBasedOnDate.length === 0) {
            return NextResponse.json({ message: 'No data found for the selected date range.' }, { status: 404 });
        }

        const totalStress = userResponsesBasedOnDate.reduce((acc, response) => {
            return acc + response.analysis_result['Stress Level'];
        }, 0) / userResponsesBasedOnDate.length || 0;

        const moodState = isNaN(totalStress) ? "No identifiable stress; appears emotionally neutral or unengaged." : totalStress < 30 ? "Calm and generally content, able to manage daily responsibilities without emotional strain." : totalStress < 70 ? "Occasionally tense or worried, especially in high-demand situations, but coping adequately." : totalStress < 90 ? "Reports feeling overwhelmed and anxious about work responsibilities." : "Extremely distressed; overwhelmed and possibly showing signs of emotional exhaustion or panic.";

        const affect = isNaN(totalStress) ? "Flat or neutral; minimal emotional expression." : totalStress < 30 ? "Broad and congruent; appropriate emotional responses with relaxed demeanor." : totalStress < 70 ? "Slightly constricted; mild anxiety with preserved capacity for positive expression." : totalStress < 90 ? "Constricted, primarily anxious with occasional appropriate smiling." : "Highly constricted; dominant anxiety with limited emotional variability, often appearing tense or agitated.";



        let totalStressBasedOnEmotions = 0
        let totalStressBasedOnEmotionLen = 0
        let totalStressBasedOnQA = 0
        let totalStressBasedOnQALen = 0


        userResponsesBasedOnDate.map((response) => {
            const emotions = response.analysis_result['analysis_type'];
            const stressLevel = response.analysis_result['Stress Level'];
            if (emotions == "emotion") {
                totalStressBasedOnEmotions += stressLevel;
                totalStressBasedOnEmotionLen += 1;
            }
            else {
                totalStressBasedOnQA += stressLevel;
                totalStressBasedOnQALen += 1;
            }
        });

        const averageStressBasedOnEmotions = totalStressBasedOnEmotionLen > 0 ? totalStressBasedOnEmotions / totalStressBasedOnEmotionLen : 0;
        const averageStressBasedOnQA = totalStressBasedOnQALen > 0 ? totalStressBasedOnQA / totalStressBasedOnQALen : 0;

        let strengths = [];
        let challenges = [];
        if (qaAssignmentBasedOnDate.length > 1) {
            strengths = qaAssignmentBasedOnDate[1].summary.progress.strengths
            challenges = qaAssignmentBasedOnDate[1].summary.progress.challenges
        }

        
        // const completion = await groq.chat.completions.create({
        //     messages: [
        //         {
        //             role: "system",
        //             content: `You are a clinical summarization assistant trained to identify and concisely report psychological and physical symptoms based on structured progress data.

        //             Your task is to:
        //             - Extract up to 3 main presenting issues based on user challenges and strategy effectiveness.
        //             - Format each issue with a numbered heading.
        //             - Include:
        //             - A brief description of the issue.
        //             - A line on duration with approximate length and progression.
        //             - A line identifying probable causes or contributing factors (based on stressors, patterns, or ineffective strategies).

        //             Use clinical but accessible language. Infer sleep, stress-related pain, and anxiety when strategy effectiveness (like “Sleep hygiene” or “Mindfulness”) is “not effective” or only “somewhat effective.”

        //             Final output format example:

        //             1. Increasing work-related stress and anxiety  
        //             Duration: Approximately 6 months, worsening in the last 2 months  
        //             Correlated with new management and increased responsibilities at work

        //             2. Sleep disturbances with difficulty falling and staying asleep  
        //             Duration: 3-4 months  
        //             Reports racing thoughts about work tasks and deadlines

        //             3. Tension headaches and neck pain  
        //             Duration: 2-3 months, occurring 3-4 times per week  
        //             Often emerges after particularly stressful workdays
        //             `
        //         },
        //         {
        //             role: "user",
        //             content: `
        //            Please summarize the following mental health progress data using the structured 3-point clinical format in json format:
        //             {
        //                 "issues": [
        //                     {
        //                         "issue": "[ISSUE]",
        //                         "description": "[DESCRIPTION]",
        //                         "duration": "[DURATION]",
        //                         "causes": "[PROBABLE CAUSES]"
        //                     }
        //                 ]
        //             }

        //             Here is the data to analyze:
        //             ${JSON.stringify(randomdata)}
        //             `
        //         }
        //     ],
        //     model: "llama-3.1-8b-instant",
        //     // model: [
        //     // "llama-3.3-70b-versatile",
        //     // "llama3-70b-8192",
        //     // "llama3-8b-8192",
        //     // 'mixtral-8x7b-32768',
        //     // "gemma2-9b-it"
        //     // ][Math.floor(Math.random() * )],
        //     temperature: 1.2,
        //     //   max_tokens: 200,
        //     response_format: { type: "json_object" }
        // });

        // let complaints = JSON.parse(completion.choices[0]?.message?.content);

        // console.log("question", complaints)

        // if (!complaints) {
        //     complaints ={ issues: []}
        // }
    


        return NextResponse.json({ moodState, affect, averageStressBasedOnEmotions, averageStressBasedOnQA, totalStress, strengths, challenges, LatestUserResponses, occupation, familyHistory, medicalHistory, personalHistory }, { status: 200 });




    }
    catch (error) {
        console.error('Error fetching user responses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}