import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'

const barChartData = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 40 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 35 },
  ]

  
export default function BarChart() {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-indigo-800">Weekly Study Hours</CardTitle>
            <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#818cf8" />
                  <XAxis dataKey="name" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip contentStyle={{ backgroundColor: '#e0e7ff', borderColor: '#6366f1' }} />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
  )
}
