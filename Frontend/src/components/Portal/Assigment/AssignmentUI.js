"use client"
import WaitingTime from '../../../components/Portal/Assigment/WaitingTime'
import React, { useState, useEffect,Suspense } from 'react'
import Loading from '../../../app/portal/assignment/loading'
const MCQAssignment=React.lazy(()=>import('../../../components/Portal/Assigment/MCQAssignment'))
const SAQAssignment=React.lazy(()=>import('../../../components/Portal/Assigment/SAQAssignment'))

export default function Assignment() {
  const [nextAssignmentDate,setNextAssignmentDate] = useState(null);
  const [latestQAAssignment,setLatestQAAssignment] = useState(null);

  async function GetAssignment(){
  
   const response = await fetch(`/api/assignment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
   })
   const data = await response.json();
   setNextAssignmentDate(data.next_assignment_date);
   setLatestQAAssignment(data.latestQAAssignment);
  }

  useEffect(() => {
    const fetchAssignment = async () => {
      await GetAssignment();
    };
    
    fetchAssignment();
  }, []);
  
  

  return (
    nextAssignmentDate==null && latestQAAssignment==null ? <Loading/>: nextAssignmentDate !== "false" ? <WaitingTime nextAssignmentDate={nextAssignmentDate} /> : latestQAAssignment == null ? 
    <Suspense fallback={<Loading/>}>
      <MCQAssignment />
    </Suspense> : 
    <Suspense fallback={<Loading/>}>
      <SAQAssignment questions={latestQAAssignment.question[0]} />
    </Suspense>

  )
}
