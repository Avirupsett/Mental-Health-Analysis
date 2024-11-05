"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../../ui/button"
import { RefreshCw } from "lucide-react"

export default function WaitingTime({nextAssignmentDate}) {
  const [reloadDisabled, setReloadDisabled] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const launchDate = new Date(nextAssignmentDate).getTime()

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
        setReloadDisabled(true);
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])



  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 md:mb-8">🚀 Stay Tuned!</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12">📅 Your Next Assignment is Just Around the Corner</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-10 md:mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-slate-200 bg-opacity-50 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</div>
              <div className="text-xs sm:text-sm uppercase">{unit}</div>
            </div>
          ))}
        </div>
        <Button size="lg" disabled={!reloadDisabled} style={{margin:"5px auto"}} onClick={() => {window.location.reload();}} className="flex items-center text-base sm:text-lg cursor-pointer m-[auto 5px]  transition-colors !h-12 !py-7 !px-9"><RefreshCw className="w-5 h-5 mr-2"/> Reload</Button>
        
        
      </div>
    </motion.div>
  )
}