'use client'

import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
// import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { SmileIcon as Breath, Activity, Moon, Brain, Users, Coffee, Clock, Palette, TriangleAlert } from 'lucide-react'
import { AutoSlider } from "./auto-slider"
import { Button } from "../../ui/button"
import { motion } from "framer-motion"
import { useTransitionRouter } from 'next-view-transitions'
import  deepBreath  from "../../../../public/images/deepbreathing.jpg"
import activity from "../../../../public/images/activity.jpg"
import sleep from "../../../../public/images/sleep.jpg"
import meditation from "../../../../public/images/meditation.jpg"
import friends from "../../../../public/images/friends.jpg"
import alcohol from "../../../../public/images/alcohol.jpg"
import time from "../../../../public/images/time.jpg"
import hobbies from "../../../../public/images/hobbies.jpg"

const stressReductionTips = [
  { tip: "Practice deep breathing exercises", icon: Breath, emoji: "🧘", image: deepBreath },
  { tip: "Engage in regular physical activity", icon: Activity, emoji: "🏃‍♀️", image: activity },
  { tip: "Maintain a healthy sleep schedule", icon: Moon, emoji: "😴", image: sleep },
  { tip: "Try mindfulness meditation", icon: Brain, emoji: "🧠", image: meditation },
  { tip: "Connect with friends and family", icon: Users, emoji: "👥", image: friends },
  { tip: "Limit caffeine and alcohol intake", icon: Coffee, emoji: "☕", image: alcohol },
  { tip: "Take breaks and practice time management", icon: Clock, emoji: "⏰", image: time },
  { tip: "Engage in hobbies or activities you enjoy", icon: Palette, emoji: "🎨", image: hobbies }
]


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function StressReductionPage() {
  const router = useTransitionRouter()
    const handleContinue = () => {
        router.replace('/portal/assignment')
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.main 
        className="container mx-auto px-4 pt-5 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div {...fadeIn}>
          <Alert variant="destructive" className="mb-8 shadow-lg rounded-lg overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-400 p-4 flex items-center justify-between sm:flex-row flex-col"
            //   whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                {/* <ExclamationTriangleIcon className="h-8 w-8 text-white mr-4" /> */}
                <div>
                  <AlertTitle className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-start"><TriangleAlert className="h-7 w-7 text-white mr-3 inline-block" /> Stress Alert 😰</AlertTitle>
                  <AlertDescription className="text-sm sm:text-lg text-white">
                    You seem to be experiencing high levels of stress. Try these recommendations to help reduce your stress levels.
                  </AlertDescription>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleContinue}
                  variant="secondary"
                  className="ml-4 sm:mt-0 mt-4 whitespace-nowrap"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
            {/* <div className="bg-white p-4">
              <p className="text-gray-700">
                Consider the following recommendations to help reduce your stress levels and improve your well-being.
              </p>
            </div> */}
          </Alert>
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl tracking-tight font-bold mb-8 text-center text-gray-800"
          {...fadeIn}
          transition={{ delay: 0.2, ...fadeIn.transition }}
        >
          Stress Reduction Recommendations
        </motion.h1>

        <motion.div 
          {...fadeIn}
          transition={{ delay: 0.4, ...fadeIn.transition }}
        >
          <AutoSlider slides={stressReductionTips} />
        </motion.div>
      </motion.main>
    </div>
  )
}

