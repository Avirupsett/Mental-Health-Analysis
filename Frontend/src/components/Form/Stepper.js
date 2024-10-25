
import { IoLocationSharp, IoPersonSharp, IoShareSocialSharp } from "react-icons/io5";
import React from 'react'
import {Link} from "next-view-transitions";
import logo from "../../../public/logo.png"
import Image from "next/image";

export default function Stepper(props) {
  
  return (
    <div>
      <Link href='/'><div  className="flex "><Image src={logo} alt="logo" width={35} height={35} className="cursor-pointer mt-[-5rem] mr-0.5 ml-0.5 sm:w-[45px] sm:h-[45px] sm:mr-4" /> <div className='text-4xl tracking-wide font-mono text-center mb-32 text-light-secondary font-bold mt-[-5rem]'>Men<span className='text-light-heading font-normal'>trix</span></div></div></Link>

      <ol className="relative text-gray-500 border-s-2 border-dashed border-light-accent dark:border-gray-700 dark:text-gray-400">
        <li className="mb-10 ms-10">
          
          <span className={`mt-1 absolute flex items-center justify-center w-10 h-10 ${props.step >= 1 ? 'bg-light-secondary' : 'bg-gray-100'} ring-white rounded-full -start-[1.3rem] ring-4  dark:ring-gray-900 dark:bg-gray-700`}>
          <IoPersonSharp className={`${props.step >= 1 ? 'text-light-primary' : ''} text-xl`}/>
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Personal Info</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Basic details about yourself </p>
        </li>

        <li className="mb-10 ms-10">
          <span className={`absolute flex items-center justify-center w-10 h-10 ${props.step >= 2 ? 'bg-light-secondary' : 'bg-gray-100'} rounded-full -start-[1.3rem] ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700`}>
            <IoLocationSharp className={`${props.step >= 2 ? 'text-light-primary' : ''} text-xl`}/>
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Location Info</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Your Location Description</p>
        </li>
        
        <li className="ms-10">
          <span className={`absolute flex items-center justify-center w-10 h-10 ${props.step >= 3 ? 'bg-light-secondary' : 'bg-gray-100'} rounded-full -start-[1.3rem] ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700`}>
           
            <IoShareSocialSharp className={`${props.step >= 3 ? 'text-light-primary' : ''} text-xl`}/>
            
          </span>
          <h3 className="text-2xl leading-normal text-light-heading font-mono font-medium">Social Media</h3>
          <p className="text-md text-light-text opacity-80 tracking-wide">Your social media accounts</p>
        </li>
      </ol>
    </div>
  )
}
