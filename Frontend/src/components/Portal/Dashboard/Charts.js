'use client'

import DailyProgressChart from "./DailyProgressChart"
import StressLevelChart from "./StressLevelChart"
import EmotionBarChart from "./EmotionBarChart"
import EmotionLineChart from "./EmotionLineChart"
export default function Charts(props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyProgressChart formattedStressLevelByDate={props.formattedStressLevelByDate} formattedEmotionLevelByDate={props.formattedEmotionLevelByDate}/>
        <StressLevelChart lowStressCount={props.lowStressCount} moderateStressCount={props.moderateStressCount} highStressCount={props.highStressCount} veryHighStressCount={props.veryHighStressCount}/>

        {Object.keys(props.emotionCounts).length > 0 && (
          <EmotionBarChart emotionCounts={props.emotionCounts}/>
        )}
        {Object.keys(props.emotionResultsByDate).length > 0 && (
          <EmotionLineChart emotionResultsByDate={props.emotionResultsByDate}/>
        )}
      </div>
  )
}
