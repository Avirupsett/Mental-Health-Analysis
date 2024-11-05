import { NextResponse } from "next/server";
import UserInfo from '../../../../models/userInfo';
import { getUser } from '@workos-inc/authkit-nextjs';
import connectDB from '../../../../lib/connectDB';

export async function POST(req) {
    try {
        await connectDB();
        const { user } = await getUser();
        const data = await req.json();

        // Fetch user info using UserInfo model
        const userInfo = await UserInfo.findOne({ user_id: user.id });

        if (!userInfo) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Update user info with new data
        Object.assign(userInfo, {
            fullname: data.fullname,
            dateofbirth: data.dateofbirth,
            gender: data.gender,
            state: data.state,
            city: data.city,
            country: data.country,
            pincode: data.pincode,
            facebook: data.facebook,
            instagram: data.instagram,
            linkedin: data.linkedin
        });

        await userInfo.save();

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
