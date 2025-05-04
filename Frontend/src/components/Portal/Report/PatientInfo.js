import React from 'react';
// import { useAppContext } from '../context/AppContext';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Users } from 'lucide-react';

export const PatientInfo = ({ patientData,occupation, lastDate}) => {
  
  if (!patientData) {
    return <div>No patient data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Patient Information</h3>
        <p className="text-slate-600 mb-4">
          Review and confirm the patient's general demographic information.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        
        <div className="md:col-span-3">
          <h4 className="text-xl font-semibold mb-2 text-purple-800">
            {patientData.fullname}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center text-slate-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span>
                Age:{" "}
                {Math.floor(
                  (new Date().getTime() - new Date(patientData.dateofbirth).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                )}{" "}
                ({new Date(patientData.dateofbirth).toLocaleDateString()})
              </span>
            </div>
            
            <div className="flex items-center text-slate-600">
              <User className="h-4 w-4 mr-2 text-purple-500" />
              <span>Gender: {patientData.gender}</span>
            </div>
            
            <div className="flex items-center text-slate-600">
              <Mail className="h-4 w-4 mr-2 text-purple-500" />
              <span>{patientData.email}</span>
            </div>
            
            
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label text-slate-700">Address</label>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-1 text-purple-500" />
            <div className="text-slate-600">
              <p>{patientData.city}, {patientData.state}, {patientData.pincode}</p>
              <p>{patientData.country}</p>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label text-slate-700">Occupation</label>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-slate-600">{occupation?occupation:"N/A"}</span>
          </div>
        </div>
      </div>

      

      <div className="bg-purple-50 border border-purple-100 rounded p-4">
        <h4 className="text-purple-800 font-medium mb-2">Patient ID: {patientData.user_id.substring(5,)}</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-slate-500">First Visit:</span> 
            <span className="ml-1 text-slate-700">{new Date(patientData.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-500">Last Visit:</span> 
            <span className="ml-1 text-slate-700">{new Date(lastDate).toLocaleDateString()}</span>
          </div>
         
        </div>
      </div>
    </div>
  );
};