import { NextResponse } from 'next/server';
import UserResponses from '../../../../models/userAnalytics';
import connectDB from '../../../../lib/connectDB';
import { getUser } from '@workos-inc/authkit-nextjs';

export async function POST(req) {
    await connectDB();
    const { user } = await getUser();
    const data = await req.json();
    console.log("Data from Emotion Result:", data);
    const userResponse = new UserResponses({
        user_id: user.id,
        analysis_result: { "Stress Level": parseFloat(data.result["Stress Level"]),
        analysis_type: "emotion",
         },
    })
    await userResponse.save();
    return NextResponse.json({ userResponse });
}