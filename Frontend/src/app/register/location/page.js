
import { Label } from '@radix-ui/react-label';
import React from 'react'

import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';
import Link from 'next/link';


export default function Location() {

    return (
        <div className='container flex min-h-screen flex-col items-center'>

            <div className='mt-10'><FaMapLocationDot className='text-8xl text-light-secondary' /></div>
            <div className='text-[44px] font-mono text-light-heading font-semibold'>Location Description</div>
            <div className='text-xl text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Enter your location description</div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">
                <Label htmlFor="country" className='text-light-heading font-sans font-bold text-md tracking-wide'>Country</Label>
                <input type="text" id="country" placeholder="Country" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                <Label htmlFor="state" className='text-light-heading font-sans font-bold text-md tracking-wide'>State</Label>
                <input type="text" id="state" placeholder="State" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid grid-cols-2 w-full max-w-xl items-center gap-2.5 mt-5">
                <div>
                    <Label htmlFor="city" className='text-light-heading font-sans font-bold text-md tracking-wide'>City</Label>
                    <input type="text" id="city" placeholder="city" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>

                <div className=''>
                    <Label htmlFor="pincode" className='text-light-heading font-sans font-bold text-md tracking-wide'>Pincode</Label>
                    <input type="number" id="pincode" placeholder="Pincode" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
                </div>
            </div>
            <div className='grid w-full max-w-xl'>
                <div className='flex justify-between  items-center mt-16'>
                    <Link href={'/register/personal'}><Button variant="outline" size="lg" className='font-sans text-md'> <IoChevronBackSharp className='mr-2 text-lg' /> Prev</Button>
                    </Link>
                    <Link href={'/register/socialMedia'}><Button size="lg" className='font-sans text-md'>Next <IoChevronForwardSharp className='ml-2 text-lg' /></Button>
                    </Link>
                </div>
            </div>

        </div>
    )
}
