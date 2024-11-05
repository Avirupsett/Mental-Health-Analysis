
import { Label } from '@radix-ui/react-label';
import React, { useContext} from 'react'

import { BsIncognito } from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { Button } from '../../components/ui/button';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { RegisterContext } from './RegisterContext';


export default function Personal(props) {
    const formContext = useContext(RegisterContext)

    function handleSubmit(e) {
        e.preventDefault()
        // formContext.setUser({...formContext.user,"name":e.target.elements.name.value,
        // "email":e.target.elements.email.value,
        // "gender":e.target.elements.gender.value,
        // "dob":e.target.elements.dob.value,
        // })
        props.setStep(2)
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className='container flex mt-16 sm:min-h-screen sm:mt-[-55px] lg:mt-0 flex-col items-center justify-center'>

                <div className='mb-1'><BsIncognito className='text-8xl text-light-secondary' /></div>
                <div className='sm:text-[44px] text-[28px] font-mono text-light-heading font-semibold'>Personal Information</div>
                <div className='sm:text-xl text-md text-light-text font-sans mt-1 opacity-80 tracking-wide mb-4'>Enter your personal information</div>
                <div className="grid w-full max-w-xl items-center gap-1.5 mt-2">
                    <Label htmlFor="fullname" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>Full Name<span className='text-red-500'>*</span></Label>
                    <input type="text" id="fullname" placeholder="Name" autoComplete='name' value={formContext.user.fullname?formContext.user.fullname:"" } onChange={(e)=>formContext.setUser({...formContext.user,"fullname":e.target.value})} className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                </div>

                <div className="grid w-full max-w-xl items-center gap-1.5 mt-5">
                    <Label htmlFor="email" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>Email<span className='text-red-500'>*</span></Label>
                    <input type="email" id="email" placeholder="Email" autoComplete='email' value={props.email} readOnly className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" required/>
                </div>
                <div className="grid grid-cols-2 w-full max-w-xl items-center gap-2.5 mt-5">
                    <div>
                        <Label htmlFor="dateofbirth" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide '>Date of Birth<span className='text-red-500'>*</span></Label>
                        <div className='mt-[0.375rem]'>
                            <input 
                                type="date" 
                                id="dateofbirth" 
                                placeholder="DD/MM/YYYY" 
                                autoComplete='bday'
                                value={formContext.user.dateofbirth ? formContext.user.dateofbirth : ""} 
                                onChange={(e) => formContext.setUser({...formContext.user, "dateofbirth": e.target.value})} 
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}
                                className="w-[98%] rounded-md border-gray-200 shadow-sm text-sm focus:border-gray-300 focus:outline-0 focus:ring-gray-300 md:text-lg" 
                                required
                            />

                        </div>
                    </div>

                    <div className=''>
                        <Label htmlFor="gender" className='text-light-heading font-sans font-bold text-sm sm:text-[16px] tracking-wide'>Gender<span className='text-red-500'>*</span></Label>
                        <div className='mt-[0.375rem]'>
                            <Select name='gender' defaultValue={formContext.user.gender?formContext.user.gender.toLowerCase():""} onValueChange={(e)=>formContext.setUser({...formContext.user,"gender":e})} className='text-[0.875rem] md:text-lg' required>
                                <SelectTrigger id='gender' className="text-[0.875rem] md:text-lg font-sans">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel className='text-sm md:text-lg font-sans'>Select</SelectLabel>
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
                        <Button type="submit" size="lg" className='mt-16 font-sans text-sm sm:text-[16px]'>Next <IoChevronForwardSharp className='ml-2 text-lg' /></Button>

                    </div>
                </div>

            </div>
        </form>
    )
}
