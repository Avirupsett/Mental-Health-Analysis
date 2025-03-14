"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { Skeleton } from "../../../components/ui/skeleton"
import { Badge } from "../../../components/ui/badge"
import { SmilePlus, Frown, Meh, AlertTriangle, SmileIcon, Video } from "lucide-react"



const emotionIcons = {
  Happy: <SmileIcon className="h-5 w-5" />,
  Sad: <Frown className="h-5 w-5" />,
  Neutral: <Meh className="h-5 w-5" />,
  Surprised: <AlertTriangle className="h-5 w-5" />,
  Angry: <Frown className="h-5 w-5" />,
}

export default function EmotionResults({ results, isLoading, videoData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

    const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 text-green-800"
      case "sad":
        return "bg-blue-100 text-blue-800"
      case "angry":
        return "bg-red-100 text-red-800"
      case "surprised":
        return "bg-yellow-100 text-yellow-800"
      case "neutral":
        return "bg-slate-100 text-slate-800"
      case "disgusted":
        return "bg-purple-100 text-purple-800"
      case "fearful":
        return "bg-violet-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmotionColorProgress = (emotion) => {
    switch (emotion) {
      case "happy":
        return "bg-green-500"
      case "sad":
        return "bg-blue-500"
      case "angry":
        return "bg-red-500"
      case "surprised":
        return "bg-yellow-500"
      case "neutral":
        return "bg-slate-500"
      case "disgusted":
        return "bg-purple-500"
      case "fearful":
        return "bg-violet-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Emotion Analysis</CardTitle>
        <CardDescription>
          {results
            ? "Analysis complete. Review the detected emotions below."
            : "Record a video to analyze emotions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!videoData ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Video className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No video recorded yet. Use the panel on the left to record a video.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ) : results ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getEmotionColor(results.dominant)}`}>
                  {emotionIcons[results.dominant] || <SmilePlus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-medium">Dominant Emotion</h3>
                  <p className="text-2xl font-bold capitalize">{results.dominant}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {Math.round(results.confidence * 100)}% Confidence
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Emotion Breakdown</h3>
              <div className="space-y-3 pr-2 h-56 overflow-y-auto">
                {Object.entries(results.emotions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, score]) => (
                    <div key={emotion} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 capitalize">
                          {emotionIcons[emotion] || <SmilePlus className={`h-4 w-4 ${getEmotionColor(emotion)}`} />}
                          {emotion}
                        </span>
                        <span className={`${getEmotionColor(emotion)} rounded-sm px-2`}>{Math.round(score * 100)}%</span>
                      </div>
                      <Progress indicatorColor={getEmotionColorProgress(emotion)} value={score * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Video className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Video recorded. Click "Analyze Emotions" to process.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

