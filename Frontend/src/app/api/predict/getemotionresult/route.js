import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import EmotionResults from '../../../../models/emotionResults';


export async function GET(req) {
    await connectDB();
    const { user } = await getUser();

    const emotionResults = await EmotionResults.find({ user_id: user.id }).sort({ createdAt: -1 });

    if (!emotionResults) {
        return NextResponse.json({ error: 'No emotion results found' }, { status: 404 });
    }

    // Find today's total duration if exists
    let todayTotalDuration = 0;
    if (emotionResults.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEmotionResults = emotionResults.filter(result => {
            const resultDate = new Date(result.created_at);
            return resultDate.toDateString() === today.toDateString();
        });

        todayTotalDuration = todayEmotionResults.reduce((total, result) => total + result.duration, 0);
    }

    // Find the previous total duration if yesterday or previous previous day doesn't exist
    let previousTotalDuration = 0;
    let previousEmotionResults = [];
    if (emotionResults.length > 0) {
        // Get the most recent date from emotion results
        const mostRecentDate = new Date();
        mostRecentDate.setHours(0, 0, 0, 0);

        // Keep looking back days until we find results
        let daysBack = 1;
        while (previousEmotionResults.length === 0 && daysBack <= 30) { // Limit to 30 days back
            const previousDay = new Date(mostRecentDate);
            previousDay.setDate(previousDay.getDate() - daysBack);
            
            previousEmotionResults = emotionResults.filter(result => {
                const resultDate = new Date(result.created_at);
                return resultDate.toDateString() === previousDay.toDateString();
            });

            daysBack++;
        }

        previousTotalDuration = previousEmotionResults.reduce((total, result) => total + result.duration, 0);
    }

    // Find yesterday's dominant emotion, confidence and timestamp most recent
    let yesterdayDominantEmotion = null;
    let yesterdayConfidence = 0;
    let yesterdayTimestamp = null;
    if (previousEmotionResults.length > 0) {
        yesterdayDominantEmotion = previousEmotionResults[0].dominant;
        yesterdayConfidence = previousEmotionResults[0].confidence;
        yesterdayTimestamp = previousEmotionResults[0].created_at;
    }

    return NextResponse.json({ todayTotalDuration, previousTotalDuration, yesterdayDominantEmotion, yesterdayConfidence, yesterdayTimestamp });
}