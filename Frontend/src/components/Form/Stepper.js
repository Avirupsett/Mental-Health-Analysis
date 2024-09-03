'use client'
import { IoCheckmarkSharp, IoLocationSharp, IoPersonSharp, IoShareSocialSharp } from "react-icons/io5";
import React from 'react'
import { usePathname } from "next/navigation";

export default function Stepper() {
  const pathname =usePathname()
  
  return (
    <div>
      <div className='text-4xl tracking-wide font-mono text-center mb-36 text-light-secondary font-bold mt-[-10rem]'>Men<span className='text-light-heading font-normal'>trix</span></div>

      <ol className="relative text-gray-500 border-s-2 border-dashed border-light-accent dark:border-gray-700 dark:text-gray-400">
        <li className="mb-10 ms-10">
          
          <span className={`mt-1 absolute flex items-center justify-center w-10 h-10 ${pathname === '/register/personal' ? 'bg-light-secondary' : 'bg-gray-100'} ring-white rounded-full -start-[1.3rem] ring-4  dark:ring-gray-900 dark:bg-gray-700`}>
          <IoPersonSharp className={`${pathname === '/register/personal' ? 'text-light-primary' : ''} text-xl`}/>
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Personal Info</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Basic details about yourself </p>
        </li>

        <li className="mb-10 ms-10">
          <span className={`absolute flex items-center justify-center w-10 h-10 ${pathname === '/register/location' ? 'bg-light-secondary' : 'bg-gray-100'} rounded-full -start-[1.3rem] ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700`}>
            <IoLocationSharp className={`${pathname === '/register/location' ? 'text-light-primary' : ''} text-xl`}/>
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Location Info</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Your Location Description</p>
        </li>
        
        <li className="ms-10">
          <span className={`absolute flex items-center justify-center w-10 h-10 ${pathname === '/register/socialMedia' ? 'bg-light-secondary' : 'bg-gray-100'} rounded-full -start-[1.3rem] ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700`}>
           
            <IoShareSocialSharp className={`${pathname === '/register/socialMedia' ? 'text-light-primary' : ''} text-xl`}/>
            
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Social Media</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Your social media accounts</p>
        </li>
      </ol>
    </div>
  )
}
