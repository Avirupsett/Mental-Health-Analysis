'use client'
import React from 'react'
import { RegisterContext } from './RegisterContext'
import Personal from './Personal'
import Location from './Location'
import SocialMedia from './SocialMedia'
import Stepper from './Stepper'
import { useState } from 'react'

import logo from "../../../public/logo.png"
import Image from 'next/image'
import {Link} from 'next-view-transitions'

export default function RegisterContextProvider(props) {
    const [step, setStep] = useState(1)
    const [user, setUser] = useState({
        "fullname": "",
        "dateofbirth": "",
        "gender": "",
        "country": "",
        "state": "",
        "city": "",
        "pincode": "",
        "facebook": "",
        "instagram": "",
        "linkedin": ""
    })

    return (
        <div className='flex min-h-screen'>
            <div className=' w-1/3 bg-light-tertiary max-lg:hidden flex-none'>
                <div className='flex items-center justify-center min-h-full'>
                    <Stepper step={step} />
                </div>
            </div>

            <div className='flex-none lg:w-2/3 w-full bg-light-primary'>
                <div className='block lg:hidden'>
                    <Link href='/'>
                        <div className="flex justify-start items-center pt-4 pl-3">
                            <Image src={logo} alt="logo" width={35} height={35} className="cursor-pointer mr-0.5 ml-0.5 sm:w-[45px] sm:h-[45px] sm:mr-2" />
                            <div className='text-2xl sm:text-4xl tracking-wide font-mono text-center text-light-secondary font-bold ml-2'>Men<span className='text-light-heading font-normal'>trix</span></div>
                        </div>
                    </Link>
                </div>
                <RegisterContext.Provider value={{ user, setUser }}>
                    {step === 1 && <Personal setStep={setStep} email={props.email} />}
                    {step === 2 && <Location setStep={setStep} />}
                    {step === 3 && <SocialMedia setStep={setStep} />}
                </RegisterContext.Provider>
            </div>
        </div>
    )
}
