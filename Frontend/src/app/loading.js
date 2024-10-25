import React from 'react'
import Loading from '../../public/loading.gif'
import Image from 'next/image'

export default function loading() {
  return (
    <div className='flex justify-center items-center h-[85vh] w-screen'>
      <Image unoptimized={true} src={Loading} alt='loading' width={150} height={150} />
    </div>
  )
}
