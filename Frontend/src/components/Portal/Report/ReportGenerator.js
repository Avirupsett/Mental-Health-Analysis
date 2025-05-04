'use client'
import React, { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { motion } from 'framer-motion';
import { PatientInfo } from './PatientInfo'; 
import { MentalStatusExam } from './MentalStatusExam';
// import { CaseHistory } from './CaseHistory';
import { SummaryView } from './SummaryView';
// import { useAppContext } from '../context/AppContext';
// import { generatePDF } from '../utils/pdfGenerator';
import { 
  ChevronRight, 
  ChevronLeft, 
  FileDown,
  AlertCircle
} from 'lucide-react';

export const ReportGenerator = (props) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [mentalStressReport, setMentalStressReport] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date()-30 * 24 * 60 * 60 * 1000)); // Default to previous 30 days
  const [endDate, setEndDate] = useState(new Date()); // Default to today


  const totalSteps = 4;

  async function getStressReport() {
    
    const response = await fetch(`/api/report/mentalstressexam`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate: startDate, endDate: endDate })
    });
    const data = await response.json();
    return data;

}

  const handleNext = async() => {
    if (currentStep === 1) {
        const stressReport = await getStressReport();
        setMentalStressReport(stressReport);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
    //   await generatePDF(patientData, dateRange);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setGenerating(false);
    }
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
//         <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//         <div>
//           <h3 className="font-medium text-red-800">Error Loading Data</h3>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

  return (
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container min-h-[calc(100vh-70px)] mx-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg"
    >
    <div className="container max-w-4xl mx-auto">
      <div className="mb-8 fade-in">
        <h2 className="text-purple-800 mb-4 mt-2 text-2xl md:text-3xl font-bold text-center">Stress Analysis Report</h2>
        <p className="text-slate-600 mb-6">
          Generate a comprehensive stress analysis report by selecting a date range and reviewing patient information.
        </p>
        
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`relative flex flex-col items-center flex-grow
                `}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    step <= currentStep 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  } transition-colors duration-300`}
                >
                  {step}
                </div>
                <div className="text-xs mt-2 font-medium text-center hidden md:block">
                  {step === 1 && 'Select Date Range'}
                  {step === 2 && 'Patient Info'}
                  {step === 3 && 'Clinical Assessment'}
                  {step === 4 && 'Review & Generate'}
                </div>
                {step <= totalSteps && (
                  <div 
                    className={`absolute top-5 right-0 left-0 h-[2px] ${
                      step < currentStep ? 'bg-purple-600' : 'bg-slate-200'
                    } transition-colors duration-300`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="card slide-up">
          <div className="card-body">
            {currentStep === 1 && <DateRangePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate}/>}
            {currentStep === 2 && <PatientInfo patientData={props.patientInfo.user} occupation={mentalStressReport.occupation} lastDate={mentalStressReport.LatestUserResponses[0].created_at}/>}
            {currentStep === 3 && (
              <div>
                <MentalStatusExam patientData={mentalStressReport} />
                {/* <CaseHistory /> */}
              </div>
            )}
            {currentStep === 4 && <SummaryView startDate={startDate} endDate={endDate} patientData={props.patientInfo.user} occupation={mentalStressReport.occupation} mentalStressReport={mentalStressReport}/>}
          </div>
          <div className="card-footer flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`btn ${
                currentStep === 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'btn-secondary'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1 inline" />
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1 inline" />
              </button>
            ) : (
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className={`btn-primary ${generating ? 'opacity-75 cursor-wait' : ''}`}
              >
                {generating ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-1 inline" />
                    Generate Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
};