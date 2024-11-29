'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AutoSlider({ slides, interval = 6000 }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [nextSlide, interval])

  const currentTip = slides[currentSlide]
  const Icon = currentTip.icon
  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="relative aspect-video">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{position: "relative",width: "100%",height: "100%"}}
          >
            <Image
              src={currentTip.image}
              alt={currentTip.tip}
              fill // Changed from layout="fill"   
              style={{ objectFit: "cover" }} 
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CardHeader className="p-0 mb-2">
            <CardTitle className="flex items-center text-2xl">
              <Icon className="mr-2 h-6 w-6" />
              <span className="mr-2 text-lg sm:text-2xl font-bold tracking-wide">Tip {currentSlide + 1}</span>
              <motion.span 
                className="text-xl sm:text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                {currentTip.emoji}
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription className="text-sm sm:text-lg text-white/90">{currentTip.tip}</CardDescription>
          </CardContent>
        </motion.div>
      </div>
      <div className="flex justify-between p-2 px-3">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" onClick={prevSlide} aria-label="Previous tip">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="icon" onClick={nextSlide} aria-label="Next tip">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Card>
  )
}

