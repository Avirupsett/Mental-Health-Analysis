
import { Label } from '@radix-ui/react-label';
import React from 'react'

import { TiSocialFacebookCircular, TiSocialInstagram, TiSocialInstagramCircular, TiSocialLinkedin, TiSocialLinkedinCircular } from "react-icons/ti";
import { Button } from '@/components/ui/button';
import { IoCheckmarkSharp, IoChevronBackSharp } from 'react-icons/io5';
import Link from 'next/link';
import { VscRobot } from "react-icons/vsc";

export default function SocialMedia() {

    return (
        <div className='container flex min-h-screen flex-col items-center'>

            <div className='mt-10'><VscRobot className='text-8xl text-light-secondary' /></div>
            <div className='text-[44px] font-mono text-light-heading font-semibold'>Social Media Profiles</div>
            <div className='text-xl text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Your presence on social networking platforms</div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">
           
            <Label htmlFor="facebook" className='text-light-heading font-sans font-bold text-md flex items-center tracking-wide'><span><TiSocialFacebookCircular className='text-lg mr-1'/></span> Facebook Link</Label>
            
                <input type="text" id="facebook" placeholder="" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                <Label htmlFor="instagram" className='text-light-heading font-sans font-bold text-md flex items-center tracking-wide'><span><TiSocialInstagram className='text-lg mr-1'/></span> Instagram Link</Label>
                <input type="text" id="instagram" placeholder="" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                <Label htmlFor="Linkedln" className='text-light-heading font-sans font-bold text-md flex items-center tracking-wide'><span><TiSocialLinkedinCircular className='text-lg mr-1'/></span> Linkedln Link</Label>
                <input type="text" id="Linkedln" placeholder="" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            
            <div className='grid w-full max-w-xl'>
                <div className='flex justify-between  items-center mt-16'>
                    <Link href={'/register/location'}><Button variant="outline" size="lg" className='font-sans text-md'> <IoChevronBackSharp className='mr-2 text-lg' /> Prev</Button>
                    </Link>
                    <Link href={'/register/socialMedia'}><Button size="lg" className='font-sans text-md'>Submit <IoCheckmarkSharp className='ml-2 text-lg' /></Button>
                    </Link>
                </div>
            </div>

        </div>
    )
}
