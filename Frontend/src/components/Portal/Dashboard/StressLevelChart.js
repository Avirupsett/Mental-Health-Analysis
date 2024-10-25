import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Brain } from 'lucide-react'




const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="rgb(79 70 229)"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="font-sans font-medium text-base tracking-wide"
        >
            {`${percent==0 ? '' : name}`}
        </text>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip font-sans p-2 border-2 rounded-md text-sm" style={{ backgroundColor: `${payload[0].payload.color}`, borderColor: '#6366f180' }}>
          <p className="user-number text-center text-gray-600">
            <span className="font-bold">{payload[0].payload.name}</span> : {payload[0].value.toFixed(2)} %
          </p>
        </div>
      );
    }

    return null;
  };

const COLORS = [ '#00C49F', '#FFBB28', '#FF8042','#EF4444']

export default function StressLevelChart(props) {
    const pieChartData = [
        { name: 'Low', value: props.lowStressCount,color:"#D1FAE5" },
        { name: 'Mid', value: props.moderateStressCount,color:'#FEF3C7' },
        { name: 'High', value: props.highStressCount,color:"#FFEDD5" },
        { name: 'Very High', value: props.veryHighStressCount,color:"#FEE2E2" }
    ]
    return (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300  border-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <CardTitle className="text-lg xl:text-xl font-semibold text-indigo-800 tracking-wide">Stress Level</CardTitle>
                <Brain className="h-6 w-6 xl:h-8 xl:w-8 text-indigo-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
                <div className="h-[280px] sm:h-[330px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                {COLORS.map((color, index) => (
                                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                dataKey="value"
                                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                label={renderCustomizedLabel}
                                labelLine={true}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={<CustomTooltip />}
                                contentStyle={{ backgroundColor: '#e0e7ff', borderColor: '#6366f1' }}
                                formatter={(value, name) => [`${value.toFixed(2)} %`, name]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
