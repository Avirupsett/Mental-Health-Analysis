"use client"

import { useState, useEffect } from "react"

export default function Tracking() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const launchDate = new Date("2024-12-31T00:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = launchDate - now

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })

      if (difference < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])



  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 md:mb-8">Coming Soon</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12">We're working hard to bring you something amazing. Stay tuned!</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-10 md:mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-slate-200 bg-opacity-50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</div>
              <div className="text-xs sm:text-sm uppercase">{unit}</div>
            </div>
          ))}
        </div>
        
        
      </div>
    </div>
  )
}