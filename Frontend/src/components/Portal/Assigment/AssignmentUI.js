import MCQAssignment from '../../../components/Portal/Assigment/MCQAssignment'
import WaitingTime from '../../../components/Portal/Assigment/WaitingTime'
import SAQAssignment from '../../../components/Portal/Assigment/SAQAssignment'
import { cookies } from 'next/headers'

export default async function Assignment() {

  async function GetAssignment(){
  const cookieStore = cookies();
   const response = await fetch(`${process.env.URL}/api/assignment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `wos-session=${cookieStore.get("wos-session")?.value}`
   }
   })
   return response.json();
  }

  const {next_assignment_date,latestQAAssignment} = await GetAssignment();
  
  

  return (
    next_assignment_date !== "false" ? <WaitingTime nextAssignmentDate={next_assignment_date} /> : latestQAAssignment == null ? <MCQAssignment /> : <SAQAssignment questions={latestQAAssignment.question[0]} />

  )
}
