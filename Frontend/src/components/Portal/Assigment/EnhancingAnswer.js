"use server"
import { cookies } from 'next/headers'

export default async function EnhancingAnswer(translatedData) {
    const cookieStore = cookies()
    const token = cookieStore.get('wos-session')?.value
    const enhancingAnswerResponse = await fetch(`${process.env.URL}/api/predict/enhancinganswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `wos-session=${token}`
        },
        body: JSON.stringify(translatedData),
        cache: 'no-store',
      });

      if (!enhancingAnswerResponse.ok) {
        console.error('Error enhancing answer:', await enhancingAnswerResponse.text());
      }

      if(enhancingAnswerResponse.ok){
        return enhancingAnswerResponse.json()
      }
      return false
}
