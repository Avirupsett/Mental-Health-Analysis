import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../lib/connectDB';
import UserResponses from '../../../models/userAnalytics';
import Progress from '../../../models/progress';

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

        // Count total assignments
        const totalAssignments = userResponses.length;

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
            const date = new Date(response.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
            if (!acc[date]) {
                acc[date] = { sum: 0, count: 0 };
            }
            acc[date].sum += response.analysis_result['Stress Level'];
            acc[date].count += 1;

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
            new Date(response.created_at) >= startOfWeek
        ).length;
        

        // Calculate average stress level for each date and format the result
        const formattedStressLevelByDate = Object.entries(stressLevelByDate).map(([date, data], index) => ({
            dayno: index + 1,
            date: new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }),
            formatted_date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric',timeZone: 'Asia/Kolkata' }),
            stress_level: data.sum / data.count
        }));

        lowStressCount = totalAssignments==0 ? 0 : lowStressCount/totalAssignments*100;
        moderateStressCount = totalAssignments==0 ? 0 : moderateStressCount/totalAssignments*100;
        highStressCount = totalAssignments==0 ? 0 : highStressCount/totalAssignments*100;
        veryHighStressCount = totalAssignments==0 ? 0 : veryHighStressCount/totalAssignments*100;

        return NextResponse.json({
            pendingAssignments,
            totalAssignments,
            assignmentsThisWeek,
            totalStressLevel,
            lowStressCount,
            moderateStressCount,
            highStressCount,
            veryHighStressCount,
            formattedStressLevelByDate
        });

    } catch (error) {
        console.error('Error in dashboard POST route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

