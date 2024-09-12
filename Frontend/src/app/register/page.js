'use client'
import Location from '../../components/Form/Location'
import Personal from '../../components/Form/Personal'
import { RegisterContext } from '../../components/Form/RegisterContext'
import SocialMedia from '../../components/Form/SocialMedia'
import Stepper from '../../components/Form/Stepper'
import React, { useState } from 'react'


export default function Register() {
    const [step, setStep] = useState(1)
    const [user, setUser] = useState({})

    return (
        <div className='flex min-h-screen'>
            <div className=' w-1/3 bg-light-tertiary max-lg:hidden flex-none'>
                <div className='flex items-center justify-center min-h-full'>
                    <Stepper step={step} />
                </div>
            </div>
            <div className='flex-none lg:w-2/3 w-full bg-light-primary'>
                <RegisterContext.Provider value={{ user, setUser }}>
                    {step === 1 && <Personal setStep={setStep} />}
                    {step === 2 && <Location setStep={setStep} />}
                    {step === 3 && <SocialMedia setStep={setStep} />}
                </RegisterContext.Provider>
            </div>
        </div>


    )
}
