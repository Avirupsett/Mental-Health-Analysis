
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
  try {
    const { user } = await getUser();
    const latestProgress = await Progress.findOne({ user_id: user.id });
    if (latestProgress && new Date(latestProgress.next_assignment_date) >= new Date()) {
      return latestProgress.next_assignment_date;
    }
    return "false";
  } catch (error) {
    console.error('Error checking next assignment date:', error);
    return "false";
  }
}

async function CheckQAAssignmentExist(params) {
  try {
    const { user } = await getUser();
    const qaAssignments = await QAAssignment.exists({ user_id: user.id });
    return qaAssignments;
  } catch (error) {
    console.error('Error checking QA assignment exist:', error);
    return null;
  }
}

async function GetLatestQAAssignment(params) {
  try {
    const { user } = await getUser();
    const latestQAAssignment = await QAAssignment.findOne().where({ user_id: user.id, answer: { $size: 0 } }).sort({ created_at: -1 });
    return latestQAAssignment;
  } catch (error) {
    console.error('Error getting latest QA assignment:', error);
    return null;
  }
}

export default async function Assignment() {
  const nextAssignmentDate = await Check_Next_Assignment_Date();
  const qaAssignmentsCount = await CheckQAAssignmentExist();

  let latestQAAssignment;
  if (qaAssignmentsCount) {
    latestQAAssignment = await GetLatestQAAssignment();
  }
  return (
    nextAssignmentDate !== "false" ? <WaitingTime nextAssignmentDate={nextAssignmentDate} /> : qaAssignmentsCount == null ? <MCQAssignment /> : <SAQAssignment questions={latestQAAssignment.question[0]} />

  )
}
