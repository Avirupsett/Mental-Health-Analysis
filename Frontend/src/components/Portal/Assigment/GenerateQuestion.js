"use server"
import { cookies } from 'next/headers'

export default async function GenerateQuestion() {
    const cookieStore = cookies()
    const token = cookieStore.get('wos-session')?.value
    const summaryResponse = await fetch(`${process.env.URL}/api/predict/generatesummary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `wos-session=${token}`
        }
      });

      if (!summaryResponse.ok) {
        console.error('Error generating summary:', await summaryResponse.text());
      }

      const generateQuestionResponse = await fetch(`${process.env.URL}/api/predict/generatequestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `wos-session=${token}`
        }
      });

      if (!generateQuestionResponse.ok) {
        console.error('Error generating question:', await generateQuestionResponse.text());
      }

      if(generateQuestionResponse.ok && summaryResponse.ok){
        return true
      }
      return false
}
