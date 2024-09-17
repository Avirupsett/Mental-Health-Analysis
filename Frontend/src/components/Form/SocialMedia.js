import { Label } from '@radix-ui/react-label';
import React, { useContext } from 'react'

import { TiSocialFacebookCircular, TiSocialInstagram, TiSocialLinkedinCircular } from "react-icons/ti";
import { Button } from '../../components/ui/button';
import { IoCheckmarkSharp, IoChevronBackSharp } from 'react-icons/io5';
import { VscRobot } from "react-icons/vsc";
import { RegisterContext } from './RegisterContext';
import { useRouter } from 'next/navigation';

export default function SocialMedia(props) {
    const formContext = useContext(RegisterContext)
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        const res=await fetch('/api/register/addUser', {
            method: 'POST',
            body: JSON.stringify(formContext.user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.status == 201) {
        router.push('/portal/assignment')
        }
        else{
            alert("User already registered")
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className='container flex mt-20 sm:min-h-screen sm:mt-0 flex-col items-center justify-center'>

                <div className='mb-1'><VscRobot className='text-8xl text-light-secondary' /></div>
                <div className='sm:text-[44px] text-[28px] font-mono text-light-heading font-semibold'>Social Media Profiles</div>
                <div className='sm:text-xl text-md text-center text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Your presence on social networking platforms</div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">

                    <Label htmlFor="facebook" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialFacebookCircular className='text-lg mr-1' /></span> Facebook Link</Label>

                    <input type="text" id="facebook" placeholder="" pattern='https://.*' value={formContext.user.facebook ? formContext.user.facebook : ""} onChange={(e) => formContext.setUser({ ...formContext.user, facebook: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="instagram" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialInstagram className='text-lg mr-1' /></span> Instagram Link</Label>
                    <input type="text" id="instagram" placeholder="" pattern='https://.*' value={formContext.user.instagram ? formContext.user.instagram : ""} onChange={(e) => formContext.setUser({ ...formContext.user, instagram: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="Linkedln" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialLinkedinCircular className='text-lg mr-1' /></span> Linkedln Link</Label>
                    <input type="text" id="Linkedln" placeholder="" pattern='https://.*' value={formContext.user.linkedin ? formContext.user.linkedin : ""} onChange={(e) => formContext.setUser({ ...formContext.user, linkedin: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>

                <div className='grid w-full max-w-xl'>
                    <div className='flex justify-between  items-center mt-16'>
                        <Button onClick={() => props.setStep(2)} variant="outline" size="lg" className='font-sans text-sm sm:text-[16px]'> <IoChevronBackSharp className='mr-2 text-lg' /> Prev</Button>
                        <Button type="submit" size="lg" className='font-sans text-sm sm:text-[16px]'>Submit <IoCheckmarkSharp className='ml-2 text-lg' /></Button>
                    </div>
                </div>

            </div>
        </form>
    )
}
