'use client';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

export const DateRangePicker = (props) => {

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Select Date Range</h3>
        <p className="text-slate-600 mb-4">
          Choose the date range for which you want to generate the stress analysis report.
          This will include all patient data and assessments recorded during this period.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <div className="relative">
            <DatePicker
              id="startDate"
              selected={props.startDate||new Date(new Date()-30 * 24 * 60 * 60 * 1000)}
              onChange={(date) => props.setStartDate(date)}
              className="input-field pl-10"
              placeholderText="Select start date"
              maxDate={new Date()}
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <div className="relative">
            <DatePicker
              id="endDate"
              selected={props.endDate||new Date()}
              onChange={(date) => props.setEndDate(date)}
              className="input-field pl-10"
              placeholderText="Select end date"
              minDate={new Date()}
              maxDate={new Date()}
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <h4 className="text-purple-800 font-medium">Report Period</h4>
        {props.startDate && props.endDate ? (
          <p className="text-purple-700">
            This report will include data from {props.startDate.toLocaleDateString('en-GB')} to {props.endDate.toLocaleDateString('en-GB')}.
          </p>
        ) : (
          <p className="text-purple-700">
            Please select both start and end dates to define the report period.
          </p>
        )}
      </div>
    </div>
  );
};