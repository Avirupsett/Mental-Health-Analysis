import React from 'react'
import FeedbackTable from '../../../components/Portal/Feedback/FeedbackTable'
import { cookies } from 'next/headers'

export const generateMetadata = async ({ params }) => {
  return {
    title: 'Feedback',
    description: 'Your personalized feedback to track your mental health journey.',
    alternates: {
      canonical: `${process.env.URL}/portal/feedback`
    }
  }
}

export default async function Feedback() {

  async function getStressReport(){
    const cookieStore = cookies();
    const token = cookieStore.get('wos-session')?.value;
    const response = await fetch(`${process.env.URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `wos-session=${token}` }
    });
    const data = await response.json();
    return data;
  }
  const stressReport = await getStressReport()||[];
  
  return (
      <FeedbackTable stressReport={stressReport}/>
  )
}
