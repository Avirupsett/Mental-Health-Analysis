import { NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';
import EmotionResults from '../../../../models/emotionResults';


export async function POST(req) {
    await connectDB();
    const { user } = await getUser();

    let data = await req.json();
    const emotionResults = new EmotionResults({
        user_id: user.id,
        dominant: data.dominant,
        confidence: data.confidence,
        emotions: data.emotions,
        duration: data.duration,
        stressLevel: data.stressLevel
    })

    await emotionResults.save();

    return NextResponse.json({ emotionResults });
}