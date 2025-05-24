import React from 'react';

import { Clock, UserPlus, GitMerge, FileWarning } from 'lucide-react';

export const CaseHistory = ({ caseHistory }) => {

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Case History</h3>
                <p className="text-slate-600 mb-4">
                    Patient's history including personal and family history.
                </p>
            </div>

            {/* <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center mb-3">
                    <FileWarning className="h-5 w-5 text-amber-500 mr-2" />
                    <h4 className="font-medium text-blue-800">Presenting Complaints</h4>
                </div>
                <div className="space-y-3">
                    {caseHistory.complaints.issues.map((complaint, index) => (
                        <div key={index} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                            <p className="font-medium text-amber-800">{complaint.description}</p>
                            <div className="flex items-center mt-2 text-sm text-amber-700">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Duration: {complaint.duration}</span>
                            </div>
                           
                        </div>
                    ))}
                </div>
            </div> */}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center mb-3">
                    <UserPlus className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-800">Personal History</h4>
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="font-medium text-slate-700">{caseHistory.personalHistory === "Yes" ? "There is a personal history of mental health issues." : caseHistory.personalHistory === "Maybe" ? "There is a possible personal history of mental health issues." : "There is no personal history of mental health issues."}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center mb-3">
                    <GitMerge className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-blue-800">Family History</h4>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="font-medium text-slate-700">{caseHistory.familyHistory == "Yes" ? "There is a family history of mental health issues." : "There is no family history of mental health issues."}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                <h4 className="font-medium text-blue-800 mb-3">Medical History</h4>

                <div className="space-y-3">
                    <div>
                        <p className="font-medium text-slate-700">{caseHistory.medicalHistory == "Yes" ? "There is a medical history of mental health issues." : "There is no medical history of mental health issues."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};