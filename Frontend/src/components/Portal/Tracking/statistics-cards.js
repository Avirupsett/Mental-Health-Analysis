"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Clock, Calendar, BarChart3 } from "lucide-react"

// Mock data - in a real app, this would come from a database or API
const getMockStatistics = () => {
  return {
    todayDuration: 1800, // 30 minutes in seconds
    yesterdayDuration: 0, // 60 minutes in seconds
    previousResult: {
      timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
      dominant: "______",
      confidence: 0.92,
    },
  }
}

export default function StatisticsCards() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Simulate fetching statistics
    const fetchStats = async () => {
      // In a real app, this would be an API call
      const data = getMockStatistics()
      setStats(data)
    }

    fetchStats()
  }, [])

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`
  }

  const formatDate=(dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-200  opacity-80"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm sm:text-xl font-medium text-indigo-950">Today's Time</CardTitle>
          <Clock className="h-6 w-6 text-indigo-950" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl text-indigo-900 font-bold mt-2">{stats ? formatDuration(stats.todayDuration) : "Loading..."}</div>
          <p className="text-xs sm:text-sm text-indigo-950 text-muted-foreground mt-1">Total video duration recorded today</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-200"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm sm:text-xl text-pink-950 font-medium">Yesterday's Time</CardTitle>
          <Calendar className="h-6 w-6 text-pink-950" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-pink-900 mt-2">{stats ? formatDuration(stats.yesterdayDuration) : "Loading..."}</div>
          <p className="text-xs sm:text-sm text-pink-950 text-muted-foreground mt-1">Total video duration recorded yesterday</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-200 opacity-80"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm sm:text-xl text-green-950 font-medium">Previous Result</CardTitle>
          <BarChart3 className="h-6 w-6 text-green-950" />
        </CardHeader>
        <CardContent className="relative z-10">
          {stats?.previousResult ? (
            <>
              <div className="text-3xl text-green-900 font-bold mt-2">{stats.previousResult.dominant}</div>
              <p className="text-xs sm:text-sm text-green-950 text-muted-foreground mt-1">
                {Math.round(stats.previousResult.confidence * 100)}% confidence at{" "}
                {formatDate(stats.previousResult.timestamp)}
              </p>
            </>
          ) : (
            <div className="text-muted-foreground">No previous results</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

