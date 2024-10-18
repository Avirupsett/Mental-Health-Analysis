import { getUser } from '@workos-inc/authkit-nextjs';
import  connectDB  from '../../../../lib/connectDB';
import UserInfo from '../../../../models/userInfo';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    const { user } = await getUser();
    
    //Check if the user is already registered
    let userInfo_exist=await UserInfo.exists({user_id:user.id});
    if(!userInfo_exist){
       try{
        await UserInfo.create({
            user_id:user.id,
            email:user.email,
            fullname:data.fullname,
            dateofbirth:data.dateofbirth,
            gender:data.gender,
            country:data.country,
            state:data.state,
            city:data.city,
            pincode:parseInt(data.pincode),
            facebook:data.facebook,
            instagram:data.instagram,
            linkedin:data.linkedin

        });

        return NextResponse.json({message:"User Registered  👍"},{status:201});
        }catch(err){               
            return NextResponse.json({message:"Please fill all the required fields"},{status:400});
        }
        

    }
    else{
        return NextResponse.json({message:"User Already Registered"},{status:409});
    }
}