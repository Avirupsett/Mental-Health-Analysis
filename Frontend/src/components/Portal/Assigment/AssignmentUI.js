"use client"
import MCQAssignment from '../../../components/Portal/Assigment/MCQAssignment'
import WaitingTime from '../../../components/Portal/Assigment/WaitingTime'
import React, { useState, useEffect } from 'react'
import SAQAssignment from '../../../components/Portal/Assigment/SAQAssignment'


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
    GetAssignment();
  }, []);
  
  

  return (
    nextAssignmentDate !== "false" ? <WaitingTime nextAssignmentDate={nextAssignmentDate} /> : latestQAAssignment == null ? <MCQAssignment /> : <SAQAssignment questions={latestQAAssignment.question[0]} />

  )
}
