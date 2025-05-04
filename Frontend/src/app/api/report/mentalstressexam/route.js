import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import UserResponses from '../../../../models/userAnalytics';
import qaAssignment from '../../../../models/qaAssignment';

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
        const occupation =FirstqaAssignment[0].answer[0]['1'] || "N/A";
        const familyHistory = FirstqaAssignment[0].answer[0]['2'] || "N/A";
        const moodSwings = FirstqaAssignment[0].answer[0]['7'] || "N/A";
        const copingStruggles = FirstqaAssignment[0].answer[0]['8'] || "N/A";
        const workInterest = FirstqaAssignment[0].answer[0]['9'] || "N/A";
        const socialWeakness = FirstqaAssignment[0].answer[0]['10'] || "N/A";
        const medicalHistory = FirstqaAssignment[0].answer[0]['3'] || "N/A";
        const userResponsesBasedOnDate = await UserResponses.find({ user_id: userId, created_at: { $gte: startDate, $lte: endDate } });
        const qaAssignmentBasedOnDate = await qaAssignment.find({ user_id: userId, created_at: { $gte: startDate, $lte: endDate } }).sort({ created_at: -1 }).limit(2);
       
        
        if (userResponsesBasedOnDate.length === 0) {
            return NextResponse.json({ message: 'No data found for the selected date range.' }, { status: 404 });
        }

        const totalStress = userResponsesBasedOnDate.reduce((acc, response) => {
            return acc + response.analysis_result['Stress Level'];
        }, 0)/userResponsesBasedOnDate.length || 0;

        const moodState = isNaN(totalStress) ? "No identifiable stress; appears emotionally neutral or unengaged." : totalStress < 30 ? "Calm and generally content, able to manage daily responsibilities without emotional strain." : totalStress < 70 ? "Occasionally tense or worried, especially in high-demand situations, but coping adequately." : totalStress < 90 ? "Reports feeling overwhelmed and anxious about work responsibilities." : "Extremely distressed; overwhelmed and possibly showing signs of emotional exhaustion or panic.";

        const affect = isNaN(totalStress) ? "Flat or neutral; minimal emotional expression." : totalStress < 30 ? "Broad and congruent; appropriate emotional responses with relaxed demeanor." : totalStress < 70 ? "Slightly constricted; mild anxiety with preserved capacity for positive expression." : totalStress < 90 ? "Constricted, primarily anxious with occasional appropriate smiling." : "Highly constricted; dominant anxiety with limited emotional variability, often appearing tense or agitated.";



        let totalStressBasedOnEmotions= 0
        let totalStressBasedOnEmotionLen= 0
        let totalStressBasedOnQA = 0
        let totalStressBasedOnQALen = 0

        
        userResponsesBasedOnDate.map((response) => {
            const emotions = response.analysis_result['analysis_type'];
            const stressLevel = response.analysis_result['Stress Level'];
            if (emotions== "emotion") {
                 totalStressBasedOnEmotions += stressLevel;
                 totalStressBasedOnEmotionLen += 1;
            }
            else{
                totalStressBasedOnQA += stressLevel;
                totalStressBasedOnQALen += 1;
            }
        });

        const averageStressBasedOnEmotions = totalStressBasedOnEmotionLen > 0 ? totalStressBasedOnEmotions / totalStressBasedOnEmotionLen : 0;
        const averageStressBasedOnQA = totalStressBasedOnQALen > 0 ? totalStressBasedOnQA / totalStressBasedOnQALen : 0;

        let strengths = [];
        let challenges = [];
        if (qaAssignmentBasedOnDate.length >1) {
            strengths = qaAssignmentBasedOnDate[1].summary.progress.strengths
            challenges = qaAssignmentBasedOnDate[1].summary.progress.challenges
        }


        return NextResponse.json({ moodState, affect, averageStressBasedOnEmotions, averageStressBasedOnQA,totalStress,strengths,challenges,LatestUserResponses,occupation }, { status: 200 });


        

    }
    catch (error) {
        console.error('Error fetching user responses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}