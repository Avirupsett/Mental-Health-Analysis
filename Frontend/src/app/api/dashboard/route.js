import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../lib/connectDB';
import UserResponses from '../../../models/userAnalytics';
import Progress from '../../../models/progress';
import EmotionResults from '../../../models/emotionResults';

export async function POST(req) {
    try {
        const { user } = await getUser();
        const userId = user.id;
        await connectDB();

        const userResponses = await UserResponses.find({ user_id: userId });

        let lowStressCount = 0;
        let moderateStressCount = 0;
        let highStressCount = 0;
        let veryHighStressCount = 0;
        const totalAssignmentsByEmotion = userResponses.filter(response => response.analysis_result['analysis_type'] == "emotion").length;

        // Count total assignments based on analysis type
        const totalAssignments = userResponses.filter(response => response.analysis_result['analysis_type'] != "emotion").length;
       

        const progress = await Progress.findOne({ user_id: userId });
        let pendingAssignments = process.env.MAX_ASSIGNMENT;
        if(progress) {
            pendingAssignments = progress.next_assignment_date > new Date() ? 0 : progress.pending_assignments;
        }

        // Calculate total stress level based on past 5 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
        const pastWeekResponses = userResponses.filter(response => new Date(response.created_at) >= oneWeekAgo);
        let totalStressLevel = pastWeekResponses.length > 0 
            ? pastWeekResponses.reduce((sum, response) => sum + response.analysis_result['Stress Level'], 0) / pastWeekResponses.length
            : userResponses.length > 0
                ? userResponses.reduce((sum, response) => sum + response.analysis_result['Stress Level'], 0) / userResponses.length
                : 0;
        if (isNaN(totalStressLevel)) {
            totalStressLevel = "0";
        }
        else {
            if (totalStressLevel == 0) {
                totalStressLevel = "0"
            }
            else if (totalStressLevel <30) {
                totalStressLevel = "Low"
            }
            else if (totalStressLevel <70) {
                totalStressLevel = "Moderate"
            }
            else if (totalStressLevel <90) {
                totalStressLevel = "High"
            }
            else {
                totalStressLevel = "Very High"
            }
        }   

        // Create dictionary of stress levels by date
        const stressLevelByDate = userResponses.reduce((acc, response) => {
            const date = new Date(response.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
            if (!acc[date]) {
                if(response.analysis_result['analysis_type'] !== "emotion") {
                acc[date] = { sum: 0, count: 0,emotion:0, emotioncount: 0 };
                }
                else {
                    acc[date] = {sum: 0, count: 0,emotion:0, emotioncount: 0 };
                }
            }
            if(response.analysis_result['analysis_type'] !== "emotion") {
            acc[date].sum += response.analysis_result['Stress Level'];
            acc[date].count += 1;
            }
            if(response.analysis_result['analysis_type'] === "emotion") {
                acc[date].emotion += response.analysis_result['Stress Level'];
                acc[date].emotioncount += 1;
            }

            if(response.analysis_result['Stress Level'] < 30) {
                lowStressCount += 1;
            }
            else if(response.analysis_result['Stress Level'] < 70) {
                moderateStressCount += 1;
            }
            else if(response.analysis_result['Stress Level'] < 90) {
                highStressCount += 1;
            }
            else {
                veryHighStressCount += 1;
            }
            return acc;
        }, {});

        // Count assignments in this week
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
        startOfWeek.setHours(0, 0, 0, 0);
        const assignmentsThisWeek = userResponses.filter(response => 
            new Date(response.created_at) >= startOfWeek && response.analysis_result['analysis_type'] != "emotion"
        ).length;
        

        // Calculate average stress level for each date and format the result
        const formattedStressLevelByDate = Object.entries(stressLevelByDate).map(([date, data], index) => ({
            dayno: index + 1,
            date: new Date(date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            formatted_date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stress_level: data.sum / data.count || 0
        }));

        // Calculate average emotion level for each date and format the result
        const formattedEmotionLevelByDate = Object.entries(stressLevelByDate).map(([date, data], index) => ({
            dayno: index + 1,
            date: new Date(date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            formatted_date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            emotion_level: data.emotion/data.emotioncount|| 0,
        }));


        lowStressCount = totalAssignments+totalAssignmentsByEmotion==0 ? 0 : lowStressCount/(totalAssignments+totalAssignmentsByEmotion)*100;
        moderateStressCount = totalAssignments+totalAssignmentsByEmotion==0 ? 0 : moderateStressCount/(totalAssignments+totalAssignmentsByEmotion)*100;
        highStressCount = totalAssignments+totalAssignmentsByEmotion==0 ? 0 : highStressCount/(totalAssignments+totalAssignmentsByEmotion)*100;
        veryHighStressCount = totalAssignments+totalAssignmentsByEmotion==0 ? 0 : veryHighStressCount/(totalAssignments+totalAssignmentsByEmotion)*100;

        const emotionResults = await EmotionResults.find({ user_id: userId });
        
        let emotionResultsByDate = {};
        let emotionCounts = {};
        if(emotionResults.length > 0) {
        // Create dictionary of emotion results by date
        emotionResultsByDate = emotionResults.reduce((acc, result) => {
            const date = new Date(result.created_at);
            if (!acc[date]) {
                acc[date] = { duration: 0, count: 0, dominant: null };
            }
            acc[date].duration += result.duration;
            acc[date].count += 1;
            if(result.dominant) {
                acc[date].dominant = result.dominant;
            }
            return acc;
        }, {});

        // Count types of emotions emotion results without date
        emotionCounts = emotionResults.reduce((acc, result) => {
            if (!result.emotions) return acc;
            
            Object.entries(result.emotions).forEach(([emotion, value]) => {
                if (!acc[emotion]) {
                    acc[emotion] = 0;
                }
                acc[emotion] += value;
            });
            return acc;
        }, {});

        // Convert emotion counts to percentages and round to 2 decimal places
        const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
        Object.keys(emotionCounts).forEach(emotion => {
            emotionCounts[emotion] = ((emotionCounts[emotion] / totalEmotions) * 100).toFixed(2);
        });

        }
        

        return NextResponse.json({
            pendingAssignments,
            totalAssignments,
            assignmentsThisWeek,
            totalStressLevel,
            lowStressCount,
            moderateStressCount,
            highStressCount,
            veryHighStressCount,
            formattedStressLevelByDate,
            formattedEmotionLevelByDate,
            emotionResultsByDate,
            emotionCounts
        });

    } catch (error) {
        console.error('Error in dashboard POST route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

