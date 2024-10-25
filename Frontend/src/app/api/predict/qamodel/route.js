import { NextResponse } from 'next/server';
import UserResponses from '../../../../models/userResponse';
import UserInfo from '../../../../models/userInfo';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';


const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
    await connectDB();
    const { user } = await getUser();

    let data = await req.json()
    const userInfo = await UserInfo.findOne({ user_id: user.id });
    data['Gender'] = userInfo ? userInfo.gender.charAt(0).toUpperCase() + userInfo.gender.slice(1) : 'Unknown';
    try {
        const response = await fetch(`${BACKEND_URL}/qamodel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result) {
            const userResponse = new UserResponses({
                user_id: user.id,
                analysis_result:
                    { "Stress Level": parseFloat(result['Stress Level']) },
            });
            await userResponse.save();
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }


}