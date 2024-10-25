import Charts from "./Charts"
import { ChartBar, ChartNetwork, ChartPie } from 'lucide-react'
import MetricsCards from "./MetricsCards"
import { cookies } from "next/headers";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export default async function DashboardUI() {

  async function fetchDashboardData() {
    const cookieStore = cookies();

    const apiUrl = `${process.env.VERCEL_URL}/api/dashboard`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `wos-session=${cookieStore.get('wos-session')?.value}`
      },
    });

    const dashboardData = await response.json()
    return dashboardData

  }

  const dashboardData = await fetchDashboardData()



  return (
    <div className="container mx-auto p-4 bg-slate-50">
      {/* Dashboard cards */}
      <MetricsCards totalAssignments={dashboardData.totalAssignments} totalStressLevels={dashboardData.totalStressLevel} assignmentsThisWeek={dashboardData.assignmentsThisWeek} />

      {/* Separator */}
      <div className="mb-2">
        <div className="flex items-center rounded-lg p-4">
          <ChartPie strokeWidth={2.5} className="h-8 w-8 text-purple-600 mr-4" />
          <h2 className="text-xl sm:text-2xl font-medium text-gray-700 font-mono tracking-wide">Detailed Analytics</h2>
          <div className="flex-grow ml-5">
            <div className="h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300"></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <Charts formattedStressLevelByDate={dashboardData.formattedStressLevelByDate} lowStressCount={dashboardData.lowStressCount} moderateStressCount={dashboardData.moderateStressCount} highStressCount={dashboardData.highStressCount} veryHighStressCount={dashboardData.veryHighStressCount} />

    </div>
  )
}