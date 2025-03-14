"use client"

import EmotionDetection from './emotion-detection'
import StatisticsCards from './statistics-cards'
import { motion } from "framer-motion"

export default function Tracking() {
 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8"
    >
       <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-4 sm:py-6 sm:px-4 md:py-6">
      <div className="px-4 mx-auto max-w-7xl">
        {/* <header className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-800">Emotion Detection</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto ">
            Analyze facial expressions in real-time to detect emotions with our advanced AI system
          </p>
        </header> */}

        <StatisticsCards />

        <div className="mt-8">
          <EmotionDetection />
                 </div>

      </div>
    </main>
    </motion.div>
  )
}