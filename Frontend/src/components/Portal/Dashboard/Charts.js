'use client'

import DailyProgressChart from "./DailyProgressChart"
import StressLevelChart from "./StressLevelChart"

export default function Charts(props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyProgressChart formattedStressLevelByDate={props.formattedStressLevelByDate}/>
        <StressLevelChart lowStressCount={props.lowStressCount} moderateStressCount={props.moderateStressCount} highStressCount={props.highStressCount} veryHighStressCount={props.veryHighStressCount}/>
      </div>
  )
}
