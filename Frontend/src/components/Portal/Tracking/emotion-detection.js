"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { RefreshCw, AlertCircle, Play, Square, Clock } from "lucide-react"
import { toast } from 'sonner';
import { Badge } from "../../../components/ui/badge"
import * as faceapi from 'face-api.js';
import EmotionResults from "./emotion-results";
import { set } from "mongoose"

// Add these constants at the top of your component
const videoWidth = 640;
const videoHeight = 480;

// Add this sample data
const sampleResults = {
  dominant: "Happy",
  confidence: 0.89,
  emotions: {
    Happy: 0.89,
    Neutral: 0.06,
    Surprised: 0.03,
    Sad: 0.01,
    Angry: 0.01,
  }
};

export default function EmotionDetection( {todayDuration, setTodayDuration} ) {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingDuration, setTrackingDuration] = useState(0)
  const [cameraError, setCameraError] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [intervalId, setIntervalId] = useState(null)
  const [emotionLogs, setEmotionLogs] = useState([])
  const [timerIntervalId, setTimerIntervalId] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  // Load face-api models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = window.location.origin + '/models';
      
      // Show loading toast
      const loadingToast = toast.loading('Loading models...');
      
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        // Update to processing toast
        toast.loading('Processing models...', {
          id: loadingToast,
        });

        // Add 8 second delay
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Update loading toast to success
        toast.success('Models loaded successfully!', {
          id: loadingToast,
        });
        
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
        
        // Update loading toast to error
        toast.error('Failed to load emotion detection models', {
          id: loadingToast,
        });
      }
    };
    
    loadModels();
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId)
      }
    }
  }, [])

  const handleCameraError = useCallback(() => {
    setCameraError(true)
    toast.error("Please allow camera access or try another input method.")
  }, [toast])

  const startFaceDetection = useCallback(() => {
    if (!modelsLoaded || !webcamRef.current) return;

    const id = setInterval(async () => {
      if (webcamRef.current && canvasRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        };

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Log emotions only if face is detected
        if (detections.length > 0) {
          const timestamp = new Date().toISOString();
          const emotions = detections[0].expressions;
          const dominantEmotion = Object.entries(emotions)
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
          
          setEmotionLogs(prev => [...prev, {
            timestamp,
            emotions,
            dominantEmotion
          }]);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    }, 100);
    
    setIntervalId(id);
  }, [modelsLoaded]);

  const startTracking = useCallback(() => {
    setEmotionLogs([]);
    setTrackingDuration(0);

    // Start face detection first
    startFaceDetection();
    
    // Start timer with useState
    const timerId = setInterval(() => {
      setTrackingDuration(prev => prev + 1);
    }, 1000);
    
    setTimerIntervalId(timerId);
    setIsTracking(true);
  }, [startFaceDetection]);

  const stopTracking = useCallback(() => {
    // Clear intervals
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }

    setIsTracking(false);

    // Calculate average emotions from logs
    if (emotionLogs.length > 0) {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(async () => {
        const totalEmotions = emotionLogs.reduce((acc, log) => {
          Object.entries(log.emotions).forEach(([emotion, value]) => {
            acc[emotion] = (acc[emotion] || 0) + value;
          });
          return acc;
        }, {});

        // Calculate averages
        const averageEmotions = Object.entries(totalEmotions).reduce((acc, [emotion, sum]) => {
          acc[emotion] = sum / emotionLogs.length;
          return acc;
        }, {});

        // Find dominant emotion
        const dominant = Object.entries(averageEmotions)
          .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

          const findStressLevel =
          averageEmotions.sad +
          averageEmotions.angry +
          averageEmotions.disgusted +
          averageEmotions.surprised +
          averageEmotions.fearful
       let stressLevel2 = Math.round(findStressLevel * 100)
        if (stressLevel2 < 0) {
          stressLevel2 = stressLevel2 + 100
          setStressLevel(stressLevel2)
        }
        else{
          setStressLevel(stressLevel2)
        }

        const results = {
          dominant,
          confidence: averageEmotions[dominant],
          emotions: averageEmotions,
          duration: trackingDuration,
          stressLevel: stressLevel,
        };

        setTodayDuration(prev => prev + trackingDuration)
        
        if (results.dominant !== null) {
          const res = await fetch('/api/predict/addemotionresult', {
            method: 'POST',
            body: JSON.stringify(results),
          });

          const res2 = await fetch('/api/predict/adduserresponse', {
            method: 'POST',
            body: JSON.stringify({
              result: {
                "Stress Level": stressLevel2,
              },

            }),
          });
        }

        setAnalysisResults(results);
        setIsAnalyzing(false);
      }, 1500); // 1.5 second delay for analysis simulation
    }

    // console.log('Tracking Session Results:', {
    //   duration: trackingDuration,
    //   emotionLogs
    // });
  }, [intervalId, timerIntervalId, trackingDuration, emotionLogs]);

  // Make sure cleanup effect handles both intervals
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [intervalId, timerIntervalId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Emotion Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {cameraError ? (
              <div className="aspect-video flex items-center justify-center bg-muted rounded-md">
                <div className="text-center p-4">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p>Camera access denied or not available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please check your browser permissions to enable camera access
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                <Webcam
                  ref={webcamRef}
                  videoConstraints={{
                    width: videoWidth,
                    height: videoHeight,
                    facingMode: "user",
                  }}
                  width={videoWidth}
                  height={videoHeight}
                  onUserMediaError={handleCameraError}
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
                {isTracking && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      Tracking {formatTime(trackingDuration)}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            size="lg"
            onClick={isTracking ? stopTracking : startTracking}
            disabled={cameraError || !modelsLoaded}
            variant={isTracking ? "destructive" : "default"}
          >
            {isTracking ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Tracking
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <EmotionResults 
        stressLevel={stressLevel}
        results={analysisResults}
        isLoading={isAnalyzing}
        videoData={isTracking || emotionLogs.length > 0}
      />
    </div>
  );
}

