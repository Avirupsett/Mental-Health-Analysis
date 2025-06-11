import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts'
import { BookOpen } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      payload[0].chartType = "AreaChart";
      return (
        <div className="custom-tooltip font-sans p-2 border-2 rounded-md text-sm" style={{ backgroundColor: '#f3e8ff', borderColor: '#8b5cf680' }}>
          <p className="user-number text-center text-gray-500 mb-1">
            Day {label}
          </p>
          <p className="label" style={{color:"#7c3aed"}}><span className="font-bold">Date:</span> {new Date(payload[0].payload.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
        {payload[0].payload.stress_level?.toFixed(2) && <p className="label" style={{color:"#7c3aed"}}><span className="font-bold">Stress Level:</span> {payload[0].payload.stress_level?.toFixed(2)} %</p>}
        {payload[0].payload.emotion_level?.toFixed(2) && <p className="label" style={{color:"#f59e42"}}><span className="font-bold">Emotion Level:</span> {payload[0].payload.emotion_level?.toFixed(2)} %</p>}
        </div>
      );
    }

    return null;
  };

export default function DailyProgressChart(prop) {
    console.log("DailyProgressChart rendered with data:", prop.formattedEmotionLevelByDate);

    // Merge the two datasets by dayno (assume both arrays are aligned)
    const mergedData = (prop.formattedStressLevelByDate || []).map((item, idx) => ({
        ...item,
        emotion_level: prop.formattedEmotionLevelByDate?.[idx]?.emotion_level ?? null
    }));

    return (
        <Card className="bg-gradient-to-br from-white to-slate-50 shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <CardTitle className="text-lg xl:text-xl font-semibold text-purple-800 tracking-wide">Daily Progress</CardTitle>
                <BookOpen className="h-6 w-6 xl:h-8 xl:w-8 text-purple-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
                <div className="h-[280px] sm:h-[330px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mergedData} margin={{ top: 0, right: 10, left: -11, bottom: 0 }}>
                            <defs>
                                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="95%" stopColor="#f59e42" stopOpacity={0.5} />
                                    <stop offset="5%" stopColor="#f59e42" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#a78bfa80" />
                            <XAxis
                                dataKey="dayno"
                                stroke="#7c3aed"
                                angle={-45} 
                                textAnchor="end"
                                tickFormatter={(value) => `Day ${value}`}
                                fontSize={14}
                            />
                            <YAxis
                                stroke="#7c3aed"
                                domain={[0, 100]}
                                fontSize={14}
                                tickCount={10}
                                allowDecimals={false}
                            ><Label
                                    offset={17}
                                    value="Stress Level -->"
                                    position="insideLeft"
                                    angle={-90}
                                    fill="#8b5cf6"
                                    style={{ textAnchor: 'middle',letterSpacing: '0.025em',fontStyle:'italic' }}
                                /></YAxis>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' }}
                                content={<CustomTooltip />}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ paddingTop: 25 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="stress_level"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#progressGradient)"
                                name="Q & A Based"
                            />
                            <Area
                                type="monotone"
                                dataKey="emotion_level"
                                stroke="#f59e42"
                                strokeDasharray="5 5" // Add dashed line for emotion level
                                fillOpacity={0.7}
                                fill="url(#emotionGradient)"
                                dot={false}
                                activeDot={false}
                                name="Emotion Based"
                            />
                        </AreaChart>
                        
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
