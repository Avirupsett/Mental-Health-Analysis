import React from 'react'
import Loading from '../../../../public/loading.gif'
import Image from 'next/image'

export default function FeedbackLoading() {
  return (
    <div className='flex justify-center items-center h-[90vh]'>
      <Image unoptimized={true} src={Loading} alt='loading' width={150} height={150} />
    </div>
  )
}
