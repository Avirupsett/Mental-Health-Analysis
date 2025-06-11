import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'

export default function EmotionLineChart({ emotionResultsByDate }) {
  // Transform the data into the format needed for the line chart
  const lineChartData = Object.entries(emotionResultsByDate).map(([timestamp, data]) => {
    // Convert timestamp to more readable format
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return {
      date: formattedDate,
      fullDateTime: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      duration: data.duration,
      dominant: data.dominant,
      count: data.count
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure chronological order

  const emotionColors = {
    neutral: '#6366f1',    // indigo-500
    happy: '#22c55e',      // green-500
    sad: '#3b82f6',       // blue-500
    angry: '#ef4444',     // red-500
    fearful: '#8b5cf6',   // violet-500
    disgusted: '#84cc16', // lime-500
    surprised: '#f59e0b'  // amber-500
  };

  // Custom dot component to show colored emotion emojis
  const CustomDot = (props) => {
    const { cx, cy, dominant } = props;
    const color = emotionColors[dominant] || '#6366f1';
    
    return (
      <g transform={`translate(${cx - 8},${cy - 8})`}>
        <circle cx="8" cy="8" r="8" fill={color} />
        <circle cx="5" cy="6" r="1" fill="white" />
        <circle cx="11" cy="6" r="1" fill="white" />
        {dominant === 'happy' && (
          <path d="M4 9.5C4 9.5 6 12 8 12C10 12 12 9.5 12 9.5" stroke="white" fill="none" strokeWidth="1" />
        )}
        {dominant === 'sad' && (
          <path d="M4 11C4 11 6 9 8 9C10 9 12 11 12 11" stroke="white" fill="none" strokeWidth="1" />
        )}
        {dominant === 'angry' && (
          <path d="M4 10.5L12 10.5" stroke="white" fill="none" strokeWidth="1" />
        )}
        {dominant === 'surprised' && (
          <circle cx="8" cy="10" r="2" fill="white" />
        )}
        {dominant === 'neutral' && (
          <path d="M4 10.5L12 10.5" stroke="white" fill="none" strokeWidth="1" />
        )}
        {dominant === 'fearful' && (
          <path d="M4 11C4 11 6 9 8 9C10 9 12 11 12 11" stroke="white" fill="none" strokeWidth="1" />
        )}
        {dominant === 'disgusted' && (
          <path d="M4 11C4 11 6 9 8 9C10 9 12 11 12 11" stroke="white" fill="none" strokeWidth="1" />
        )}
      </g>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
      <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
        <CardTitle className="text-lg xl:text-xl font-semibold text-indigo-800 tracking-wide">Session Duration Trends</CardTitle>
        <Calendar className="h-6 w-6 xl:h-8 xl:w-8 text-indigo-600 flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="h-[280px] sm:h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#818cf880" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#4f46e5" 
                angle={-45} 
                textAnchor="end" 
                fontSize={12}
                interval={0}
                ticks={lineChartData.length > 10 ? lineChartData.map((_, i) => i % Math.ceil(lineChartData.length / 10) === 0 ? lineChartData[i].date : null).filter(Boolean) : lineChartData.map(item => item.date)}
              />
              <YAxis
                stroke="#4f46e5" 
                label={{ value: 'Duration (seconds)', offset: 17, angle: -90, position: 'insideLeft',style:{ textAnchor: 'middle',letterSpacing: '0.025em',fontStyle:'italic' } }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#e0e7ff', borderColor: '#6366f1' }}
                formatter={(value, name, props) => {
                  if (name === 'duration') {
                    return [
                      <span>
                        <b>Time:</b> {props.payload.fullDateTime}<br/>
                        <b>Duration:</b> {value} seconds<br/>
                        <b>Dominant:</b> {props.payload.dominant.charAt(0).toUpperCase() + props.payload.dominant.slice(1)}
                      </span>,
                    ];
                  }
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="duration"
                stroke="#6366f1"
                fill="url(#colorDuration)"
                strokeWidth={2}
                dot={(props) => <CustomDot {...props} dominant={props.payload.dominant} />}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
