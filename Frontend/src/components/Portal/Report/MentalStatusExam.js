import React from 'react';
import { Brain, Eye, AlertTriangle, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

export const MentalStatusExam = ({ patientData}) => {

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Mental Status Examination</h3>
        <p className="text-slate-600 mb-4">
          Summary of the patient's psychological functioning during the examination period.
        </p>
      </div>

      

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <h4 className="font-medium text-purple-800">Mood & Affect</h4>
          </div>
          <div className="space-y-5">
            <div>
              <p className="font-medium text-slate-700 text-sm">Mood State</p>
              <p className="text-slate-600">{patientData.moodState}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">Affect</p>
              <p className="text-slate-600">{patientData.affect}</p>
            </div>
            
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-800">Stress Analysis</h4>
          </div>
          <div className="space-y-5">
          <div>
              <p className="font-medium text-slate-700 text-sm">Stress Level Based on Q&A</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      patientData.averageStressBasedOnQA > 70 
                        ? 'bg-red-500' 
                        : patientData.averageStressBasedOnQA > 40 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${patientData.averageStressBasedOnQA}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-slate-600">{patientData.averageStressBasedOnQA.toFixed(2)}/100</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">Stress Level Based on Emotions</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      patientData.averageStressBasedOnEmotions > 70 
                        ? 'bg-red-500' 
                        : patientData.averageStressBasedOnEmotions > 40 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${patientData.averageStressBasedOnEmotions}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-slate-600">{patientData.averageStressBasedOnEmotions.toFixed(2)}/100</span>
              </div>
            </div>
            {/* <div>
              <p className="font-medium text-slate-700 text-sm">Overall Stress Level</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      patientData.totalStress > 70 
                        ? 'bg-red-500' 
                        : patientData.totalStress > 40 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${patientData.totalStress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-slate-600">{patientData.totalStress.toFixed(2)}/100</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
        <h4 className="font-medium text-purple-800 mb-3">Functioning Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-slate-700 flex items-center mb-2">
              <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
              Strengths
            </h5>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {patientData.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-slate-700 flex items-center mb-2">
              <ThumbsDown className="h-4 w-4 text-red-500 mr-1" />
              Challenges
            </h5>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {patientData.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};