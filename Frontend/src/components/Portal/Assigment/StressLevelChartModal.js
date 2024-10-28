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
import { Activity } from "lucide-react"


export default function StressLevelChartModal({showModal, setShowModal, stressLevel}) {
  let stressData = [
    { name: "High", value: parseFloat(stressLevel), color: "#C026D3" },
    { name: "Low", value: 100 - parseFloat(stressLevel), color: "#FAE8FF" },
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

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">View Stress Levels</Button>
      </DialogTrigger> */}
      <AnimatePresence>
        {showModal && (
          <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden bg-gradient-to-br from-background to-secondary">
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
              <div className="py-4 w-full  flex flex-col items-center">
                <ChartContainer
                  config={{
                    low: { label: "Low", color: "hsl(var(--chart-1))" },
                    high: { label: "High", color: "hsl(var(--chart-3))" },
                  }}
                  className="w-[250px] h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%" aspect={1}>
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
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-between w-full mt-6 bg-background/50 p-4 rounded-lg backdrop-blur-sm">
                  {stressData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium">{entry.name} Stress</span>
                      {/* <span className="ml-2 text-sm text-muted-foreground">
                        {entry.value}%
                      </span> */}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}