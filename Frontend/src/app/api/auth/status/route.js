import { getUser } from '@workos-inc/authkit-nextjs';
import  connectDB  from '../../../../lib/connectDB';
import UserInfo from '../../../../models/userInfo';
import { redirect } from 'next/navigation'

export async function GET() {
    await connectDB();
    const { user } = await getUser();
    let userInfo_exist=await UserInfo.exists({user_id:user.id});
    if(!userInfo_exist){
        redirect('/register');
    }
    else{
        redirect('/portal/dashboard');
    }
}