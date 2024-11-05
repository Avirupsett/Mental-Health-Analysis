import { NextResponse } from "next/server";
import UserInfo from '../../../../models/userInfo';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';

export async function POST() {
    try {
        await connectDB();
        const { user } = await getUser();

        // Fetch user info using UserInfo model
        const userInfo = await UserInfo.findOne({ user_id: user.id });

        if (!userInfo) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: userInfo
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


