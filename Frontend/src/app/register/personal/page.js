
import { Label } from '@radix-ui/react-label';
import React from 'react'

import { BsIncognito } from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { IoChevronForwardSharp } from 'react-icons/io5';
import Link from 'next/link';


export default function Personal() {

    return (
        <div className='container flex min-h-screen flex-col items-center'>

            <div className='mt-10'><BsIncognito className='text-8xl text-light-secondary' /></div>
            <div className='text-[44px] font-mono text-light-heading font-semibold'>Personal Information</div>
            <div className='text-xl text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Enter your personal information</div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">
                <Label htmlFor="name" className='text-light-heading font-sans font-bold text-md tracking-wide'>Full Name</Label>
                <input type="text" id="name" placeholder="Name" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                <Label htmlFor="email" className='text-light-heading font-sans font-bold text-md tracking-wide'>Email</Label>
                <input type="email" id="email" placeholder="Email" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />
            </div>
            <div className="grid grid-cols-2 w-full max-w-xl items-center gap-2.5 mt-5">
                <div>
                    <Label htmlFor="dob" className='text-light-heading font-sans font-bold text-md tracking-wide '>Date of Birth</Label>
                    <div className='mt-[0.375rem]'>
                        <input type="date" id="dob" placeholder="DD/MM/YYYY" className="w-[98%] rounded-md border-gray-200 shadow-sm sm:text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" />

                    </div>
                </div>

                <div className=''>
                    <Label htmlFor="dob" className='text-light-heading font-sans font-bold text-md tracking-wide'>Gender</Label>
                    <div className='mt-[0.375rem]'>
                        <Select className='text-lg'>
                            <SelectTrigger className="py-5 md:text-lg font-sans">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className='text-md font-sans'>Select</SelectLabel>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="others">Others</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className='grid w-full max-w-xl'>
                <div className='flex justify-end'>
                    <Link href={'/register/location'}><Button size="lg" className='mt-16 font-sans text-md'>Next <IoChevronForwardSharp className='ml-2 text-lg' /></Button>
                    </Link>
                </div>
            </div>

        </div>
    )
}
