import React from 'react';
import { CalendarRange, User, Brain, Clock, Check, FileBadge } from 'lucide-react';

export const SummaryView = ({patientData, startDate, endDate, occupation, mentalStressReport}) => {

  if (!patientData || !startDate || !endDate ) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Missing required information. Please complete all previous steps.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Report Summary</h3>
        <p className="text-slate-600 mb-4">
          Review the information below before generating the final report.
        </p>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <FileBadge className="h-5 w-5 text-purple-600 mr-2" />
          <h4 className="font-medium text-purple-800">Report Overview</h4>
        </div>
        <div className="flex items-center text-purple-700 mb-2">
          <CalendarRange className="h-4 w-4 mr-2" />
          <span>
            Period: {startDate.toLocaleDateString('en-GB')} to {endDate.toLocaleDateString('en-GB')}
          </span>
        </div>
        <div className="flex items-center text-purple-700 ">
          <User className="h-4 w-4 mr-2" />
          <span style={{overflowWrap: "anywhere"}}>Patient: {patientData.fullname} (ID: {patientData.user_id.substring(5,)})</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <h4 className="font-medium text-purple-800 mb-3">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium">{patientData.fullname}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Age</p>
              <p className="font-medium">{Math.floor(
                  (new Date().getTime() - new Date(patientData.dateofbirth).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                )}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Gender</p>
              <p className="font-medium">{patientData.gender}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Occupation</p>
              <p className="font-medium">{occupation}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-800">Mental Status Summary</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-slate-700">Stress Level base on Q&A</p>
              <div className="flex items-center">
                <div className="w-32 bg-slate-200 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      mentalStressReport.averageStressBasedOnQA > 70
                        ? 'bg-red-500' 
                        : mentalStressReport.averageStressBasedOnQA > 40
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${mentalStressReport.averageStressBasedOnQA}%` }}
                  ></div>
                </div>
                <span className="text-sm">{mentalStressReport.averageStressBasedOnQA.toFixed(2).padStart(5, '0')}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-slate-700">Stress Level base on Emotions</p>
              <div className="flex items-center">
                <div className="w-32 bg-slate-200 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      mentalStressReport.averageStressBasedOnEmotions > 70
                        ? 'bg-red-500' 
                        : mentalStressReport.averageStressBasedOnEmotions > 40
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${mentalStressReport.averageStressBasedOnEmotions}%` }}
                  ></div>
                </div>
                <span className="text-sm">
                  {mentalStressReport.averageStressBasedOnEmotions.toFixed(2).padStart(5, '0')}%
                </span>
              </div>
            </div>
            {/* <div className="flex items-center justify-between flex-wrap">
              <p className="text-slate-700">Overall Stress Level</p>
              <div className="flex items-center">
                <div className="w-32 bg-slate-200 rounded-full h-2 mr-2">
                <div 
                    className={`h-2 rounded-full ${
                      mentalStressReport.totalStress > 70
                        ? 'bg-red-500' 
                        : mentalStressReport.totalStress > 40
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${mentalStressReport.totalStress }%` }}
                  ></div>
                </div>
                <span className="text-sm">{mentalStressReport.totalStress.toFixed(2).padStart(5, '0')}%</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-amber-500 mr-2" />
            <h4 className="font-medium text-purple-800">Presenting Complaints Summary</h4>
          </div>
          <ul className="space-y-2">
            {patientData.caseHistory.presentingComplaints.map((complaint, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">{complaint.description}</p>
                  <p className="text-sm text-slate-600">Duration: {complaint.duration}</p>
                </div>
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <h4 className="text-purple-800 font-medium">Report Ready for Generation</h4>
        <p className="text-purple-700 mt-1">
          The stress analysis report is ready to be generated. Please review all information 
          for accuracy before proceeding. The PDF report will include all sections reviewed.
        </p>
      </div>
    </div>
  );
};