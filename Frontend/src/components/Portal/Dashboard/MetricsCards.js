import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { CheckCircle, Clock, Activity } from 'lucide-react'

export default function MetricsCards(props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base xl:text-lg font-medium text-green-800 tracking-wide">Completed Assignments</CardTitle>
            <CheckCircle className="h-6 w-6 xl:h-8 xl:w-8 ml-2 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl sm:text-3xl font-bold text-green-800 tracking-wide">{props.totalAssignments}</div>
            <p className="text-sm text-green-700 mt-1">+{props.assignmentsThisWeek} this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base xl:text-lg font-medium text-yellow-800 tracking-wide">Pending Assignments</CardTitle>
            <Clock className="h-6 w-6 xl:h-8 xl:w-8 ml-2 text-yellow-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-800 tracking-wide">{props.pendingAssignments}</div>
            <p className="text-sm text-yellow-700 mt-1">Due Today</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base xl:text-lg font-medium text-blue-800 tracking-wide">Stress Level</CardTitle>
            <Activity className="h-6 w-6 xl:h-8 xl:w-8 ml-2 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl sm:text-3xl font-bold text-blue-800 tracking-wide">{props.totalStressLevels}</div>
            <p className="text-sm text-blue-700 mt-1">Based on recent activity</p>
          </CardContent>
        </Card>
      </div>
  )
}
