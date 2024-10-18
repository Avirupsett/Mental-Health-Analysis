'use client'
import { Label } from '@radix-ui/react-label';
import React, { useContext, useState } from 'react'

import { TiSocialFacebookCircular, TiSocialInstagram, TiSocialLinkedinCircular } from "react-icons/ti";
import { Button } from '../../components/ui/button';
import { IoCheckmarkSharp, IoChevronBackSharp } from 'react-icons/io5';
import { VscRobot } from "react-icons/vsc";
import { RegisterContext } from './RegisterContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function SocialMedia(props) {
    const formContext = useContext(RegisterContext)
    const [disabled, setDisabled] = useState(false)
    const router = useRouter()

    async function handleSubmit(e) {
        setDisabled(true)
        e.preventDefault()
        router.prefetch('/portal/assignment')
        const res = await fetch('/api/register/addUser', {
            method: 'POST',
            body: JSON.stringify(formContext.user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.status == 201) {
            res.json().then(data => { toast.success(data.message) })
            router.replace('/portal/assignment')
        }
        else if (res.status == 409) {
            res.json().then(data => { toast.info(data.message) })
            router.replace('/portal/assignment')
        }
        else {
            res.json().then(data => { toast.error(data.message); setDisabled(false) })
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className='container flex mt-16 sm:min-h-screen sm:mt-[-55px] lg:mt-0 flex-col items-center justify-center'>

                <div className='mb-1'><VscRobot className='text-8xl text-light-secondary' /></div>
                <div className='sm:text-[44px] text-[28px] font-mono text-light-heading font-semibold'>Social Media Profiles</div>
                <div className='sm:text-xl text-md text-center text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Your presence on social networking platforms</div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">

                    <Label htmlFor="facebook" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialFacebookCircular className='text-lg mr-1' /></span> Facebook Link<span className='text-sm text-gray-500 ml-1'>(Optional)</span></Label>

                    <input type="text" id="facebook" placeholder="" pattern='https://.*' value={formContext.user.facebook ? formContext.user.facebook : ""} onChange={(e) => formContext.setUser({ ...formContext.user, facebook: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="instagram" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialInstagram className='text-lg mr-1' /></span> Instagram Link<span className='text-sm text-gray-500 ml-1'>(Optional)</span></Label>
                    <input type="text" id="instagram" placeholder="" pattern='https://.*' value={formContext.user.instagram ? formContext.user.instagram : ""} onChange={(e) => formContext.setUser({ ...formContext.user, instagram: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="Linkedln" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] flex items-center tracking-wide'><span><TiSocialLinkedinCircular className='text-lg mr-1' /></span> Linkedln Link<span className='text-sm text-gray-500 ml-1'>(Optional)</span></Label>
                    <input type="text" id="Linkedln" placeholder="" pattern='https://.*' value={formContext.user.linkedin ? formContext.user.linkedin : ""} onChange={(e) => formContext.setUser({ ...formContext.user, linkedin: e.target.value })} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>

                <div className='grid w-full max-w-xl'>
                    <div className='flex justify-between  items-center mt-16'>
                        <Button disabled={disabled} onClick={() => props.setStep(2)} variant="outline" size="lg" className='font-sans text-sm sm:text-[16px]'> <IoChevronBackSharp className='mr-2 text-lg' /> Prev</Button>
                        <Button type="submit" size="lg" disabled={disabled} className='font-sans text-sm sm:text-[16px] disabled:bg-slate-500'>Submit <IoCheckmarkSharp className='ml-2 text-lg' /></Button>
                    </div>
                </div>

            </div>
        </form>
    )
}
