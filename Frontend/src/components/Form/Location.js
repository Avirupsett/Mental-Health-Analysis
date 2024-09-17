
import { Label } from '@radix-ui/react-label';
import React, { useContext } from 'react'

import { PiCityBold } from "react-icons/pi";
import { Button } from '../../components/ui/button';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';
import { RegisterContext } from './RegisterContext';


export default function Location(props) {
    const formContext = useContext(RegisterContext)

    function handleSubmit(e) {
        e.preventDefault()
        props.setStep(3)
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className='container flex mt-20 sm:min-h-screen sm:mt-0 flex-col items-center justify-center'>

                <div className='mb-1'><PiCityBold className='text-8xl text-light-secondary' /></div>
                <div className='sm:text-[44px] text-[28px] font-mono text-light-heading font-semibold'>Location Description</div>
                <div className='sm:text-xl text-md text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Enter your location description</div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">
                    <Label htmlFor="country" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>Country</Label>
                    <input type="text" id="country" placeholder="Country" value={formContext.user.country?formContext.user.country:""} onChange={(e) => { formContext.setUser({ ...formContext.user, country: e.target.value }) }} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                </div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="state" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>State</Label>
                    <input type="text" id="state" placeholder="State" value={formContext.user.state?formContext.user.state:""} onChange={(e) => { formContext.setUser({ ...formContext.user, state: e.target.value }) }} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                </div>
                <div className="grid grid-cols-2 w-full max-w-xl items-center gap-2.5 mt-5">
                    <div>
                        <Label htmlFor="city" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>City</Label>
                        <input type="text" id="city" placeholder="city" value={formContext.user.city?formContext.user.city:""} onChange={(e) => { formContext.setUser({ ...formContext.user, city: e.target.value }) }} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                    </div>

                    <div className=''>
                        <Label htmlFor="pincode" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>Pincode</Label>
                        <input type="number" id="pincode" placeholder="Pincode" value={formContext.user.pincode?formContext.user.pincode:""} onChange={(e) => { formContext.setUser({ ...formContext.user, pincode: e.target.value }) }} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                    </div>
                </div>
                <div className='grid w-full max-w-xl'>
                    <div className='flex justify-between  items-center mt-16'>
                        <Button onClick={() => { props.setStep(1) }} variant="outline" size="lg" className='font-sans text-sm sm:text-[16px]'> <IoChevronBackSharp className='mr-2 text-lg' /> Prev</Button>
                        <Button type="submit" size="lg" className='font-sans text-sm sm:text-[16px]'>Next <IoChevronForwardSharp className='ml-2 text-lg' /></Button>
                    </div>

                </div>

            </div>
        </form>
    )
}
