"use client"

import { useState, useMemo, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { motion, AnimatePresence } from "framer-motion"
import { Activity,ArrowRight,Loader2 } from "lucide-react"
import { useTransitionRouter } from 'next-view-transitions'

export default function StressLevelChartModal({ showModal, setShowModal, stressLevel, isDisabled, warningType }) {
 
  let stressData = [
    { name: "High", value: parseFloat(stressLevel), color: "#9333EA" },
    { name: "Low", value: 100 - parseFloat(stressLevel), color: "#F3E8FF" },
  ]
  // const [open, setOpen] = useState(true)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [startAngle, setStartAngle] = useState(90)
  const [endAngle, setEndAngle] = useState(90)

  const totalStress = useMemo(() => {
    return stressData.reduce((acc, curr) => acc + curr.value, 0)
  }, [stressLevel])

  const weightedStressLevel = useMemo(() => {
    const highStressPercentage = (parseFloat(stressLevel) / totalStress) * 100
    return Math.round(highStressPercentage)
  }, [totalStress, stressLevel])

  useEffect(() => {
    if (showModal) {
      setAnimatedPercentage(0)
      setStartAngle(90)
      setEndAngle(90)

      const percentageTimer = setInterval(() => {
        setAnimatedPercentage((prev) => {
          if (prev < weightedStressLevel) {
            return prev + 1
          }
          clearInterval(percentageTimer)
          return weightedStressLevel
        })
      }, 20)

      const angleTimer = setInterval(() => {
        setEndAngle((prev) => {
          if (prev > -270) {
            return prev - 5
          }
          clearInterval(angleTimer)
          return -270
        })
      }, 16)

      return () => {
        clearInterval(percentageTimer)
        clearInterval(angleTimer)
      }
    }
  }, [showModal, weightedStressLevel])

  const router = useTransitionRouter()
  const handleNextAssignment = () => {
    setShowModal(false);
    if(warningType == 1){
      router.replace('/portal/recommendation')
    }else if(warningType == 2){
      router.replace('/portal/councelor')
    }else{
      window.scrollTo(0,0); window.location.reload();
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">View Stress Levels</Button>
      </DialogTrigger> */}
      <AnimatePresence>
        {showModal && (
          <DialogContent  onInteractOutside={(e) => {
              e.preventDefault();
            }} className="sm:max-w-[525px] p-0 overflow-hidden bg-gradient-to-br from-background to-secondary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Activity className="w-8 h-8 text-primary text-purple-600 mr-2" />
                  Stress Level Insights
                </DialogTitle>
                <DialogDescription className="text-sm md:text-lg">
                  Visualizing your current stress distribution
                </DialogDescription>
              </DialogHeader>
              <div className="pt-4 w-full  flex flex-col items-center">
                <ChartContainer
                  config={{
                    low: { label: "Low", color: "hsl(var(--chart-1))" },
                    high: { label: "High", color: "hsl(var(--chart-3))" },
                  }}
                  className="w-[250px] h-[250px]"
                >

                  <PieChart>
                    <Pie
                      data={stressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={startAngle}
                      endAngle={endAngle}
                    // strokeWidth={0}
                    >
                      {stressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="fill-primary text-4xl md:text-5xl font-bold"
                              >
                                {animatedPercentage}%
                              </text>
                              <text
                                x={cx}
                                y={cy + 30}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="fill-muted-foreground text-base md:text-lg"
                              >
                                Stress Level
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>

                </ChartContainer>

                <div className="w-full flex justify-center items-center mt-7">
                  <Button disabled={!isDisabled} size="lg" variant="outline" onClick={() => {handleNextAssignment()}} className="flex items-center text-base sm:text-lg cursor-pointer border-purple-600 text-purple-600 relative overflow-hidden group !h-12 !py-7 !px-10">
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                     {isDisabled ? <ArrowRight className="w-5 h-5 mr-2 inline-block" /> : <Loader2 className="w-5 h-5 mr-2 inline-block animate-spin" />}
                     {!isDisabled ? "Please wait" : "Next Assignment"}
                    </span>
                    <div className="absolute inset-0 bg-purple-600 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
                  </Button>

                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}