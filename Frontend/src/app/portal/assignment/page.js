
import MCQAssignment from '../../../components/Portal/Assigment/MCQAssignment'
import WaitingTime from '../../../components/Portal/Assigment/WaitingTime'
import React from 'react'
import { getUser } from "@workos-inc/authkit-nextjs"
import Progress from '../../../models/progress'
import QAAssignment from '../../../models/qaAssignment'
import SAQAssignment from '../../../components/Portal/Assigment/SAQAssignment'
export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }) => {
  return {
    title: 'Mental Health Assessment',
    description: 'Complete your personalized mental health questionnaire and receive feedback.',
    alternates: {
      canonical: `${process.env.URL}/portal/assignment`
    }
  }
}
async function Check_Next_Assignment_Date(params) {
    const { user } = await getUser();
    const latestProgress = await Progress.findOne({ user_id: user.id });
    if (latestProgress && new Date(latestProgress.next_assignment_date)>=new Date()) {
        return latestProgress.next_assignment_date;
    }
    return "false";
}
const nextAssignmentDate = await Check_Next_Assignment_Date();

async function CheckQAAssignmentExist(params) {
  const { user } = await getUser();
  const qaAssignments = await QAAssignment.exists({ user_id: user.id });
  return qaAssignments;
}
const qaAssignmentsCount = await CheckQAAssignmentExist();

async function GetLatestQAAssignment(params) {
  const { user } = await getUser();
  const latestQAAssignment = await QAAssignment.findOne().where({ user_id: user.id,answer:{$size:0} }).sort({ created_at: -1 });
  return latestQAAssignment;
}

let latestQAAssignment;
if(qaAssignmentsCount){
  latestQAAssignment = await GetLatestQAAssignment();
}

export default function Assignment() {
  return (
    // nextAssignmentDate!=="false" ? <WaitingTime nextAssignmentDate={nextAssignmentDate}/> : qaAssignmentsCount==null ? <MCQAssignment/> : <SAQAssignment questions={latestQAAssignment.question[0]}/>
    <WaitingTime nextAssignmentDate={nextAssignmentDate}/>
  )
}
