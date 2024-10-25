import React from 'react'
import FeedbackTable from '../../../components/Portal/Feedback/FeedbackTable'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Feedback() {

  async function getStressReport(){
    const cookieStore = cookies();
    const token = cookieStore.get('wos-session')?.value;
    const response = await fetch(`${process.env.VERCEL_URL}/api/feedback`, {
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
