import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { Calendar } from 'lucide-react'



export default function EmotionBarChart(props) {
  const barChartData = [
      { name: 'Neutral', value: props.emotionCounts.neutral, fill: '#6366f1' },  // indigo-500
      { name: 'Happy', value: props.emotionCounts.happy, fill: '#22c55e' },      // green-500
      { name: 'Sad', value: props.emotionCounts.sad, fill: '#3b82f6' },          // blue-500
      { name: 'Angry', value: props.emotionCounts.angry, fill: '#ef4444' },      // red-500
      { name: 'Fearful', value: props.emotionCounts.fearful, fill: '#8b5cf6' },  // violet-500
      { name: 'Disgusted', value: props.emotionCounts.disgusted, fill: '#84cc16' }, // lime-500
      { name: 'Surprised', value: props.emotionCounts.surprised, fill: '#f59e0b' }, // amber-500
    ]
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
            <CardTitle className="text-lg xl:text-xl font-semibold text-indigo-800 tracking-wide">Emotion Level</CardTitle>
            <Calendar className="h-6 w-6 xl:h-8 xl:w-8 text-indigo-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="h-[280px] sm:h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 0, right: 10, left: -11, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#818cf880" vertical={false}/>
                  <XAxis dataKey="name" stroke="#4f46e5" angle={-45} textAnchor="end" fontSize={14} />
                  <YAxis stroke="#4f46e5" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#e0e7ff', borderColor: '#6366f1' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#6366f1" 
                    fillOpacity={0.8}
                    radius={[5, 5, 0, 0]}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      formatter={(value) => `${value}%`}
                      style={{ fill: '#4f46e5', fontSize: '12px', fontWeight: '500' }}
                    />
                    {
                      barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
  )
}
