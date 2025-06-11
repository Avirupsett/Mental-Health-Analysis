"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { AlertCircle, Mail, X } from "lucide-react"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { toast } from 'sonner';

export default function DoctorList(props) {
  const [open, setOpen] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  console.log(props.qaAssignments)

  const doctors = [

    {
      name: "Ms. Niharika Bajpai",
      specialty: "Psychologist",
      experience: "4+ years",
      photo: "https://images.apollo247.in/doctors/0003a827-78aa-4b45-8a8c-f4f98e44af09-1702356693875.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-ms-niharika-bajpai-0003a827-78aa-4b45-8a8c-f4f98e44af09?source=Listing_Page",
      price: 2500,
      phone: "+91 9876543210",
      email: "niharika.bajpai@example.com"
    },
    {
      name: "Dr Richa Kumari",
      specialty: "Psychiatrist",
      experience: "10+ years",
      photo: "https://images.apollo247.in/doctors/783a4253-7fbf-4e4a-9909-f6075c0b8592-1732278126206.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-richa-kumari-783a4253-7fbf-4e4a-9909-f6075c0b8592?source=Listing_Page",
      price: 1500,
      phone: "+91 9876543210",
      email: "richa.kumari@example.com"
    },
    {
      name: "Dr. Vishakha Rathi",
      specialty: "Psychologist",
      experience: "4+ years",
      photo: "https://images.apollo247.in/doctors/bcd8c5a5-d405-47c4-b55d-871bc2dacf10.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-vishakha-rathi-bcd8c5a5-d405-47c4-b55d-871bc2dacf10?source=Listing_Page",
      price: 2000,
      phone: "+91 9876543210",
      email: "vishakha.rathi@example.com"
    },
    {
      name: "Abrar Raza",
      specialty: "Psychologist",
      experience: "8+ years",
      photo: "https://images.apollo247.in/doctors/ae7fd5ea-790e-46b5-94c1-5a84f6afb325-1730877075825.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-abrar-raza-ae7fd5ea-790e-46b5-94c1-5a84f6afb325?source=Listing_Page",
      price: 1500,
      phone: "+91 9876543210",
      email: "abrar.raza@example.com"
    },
    {
      name: "Ms. Rajeshwari Luther",
      specialty: "Psychologist",
      experience: "23+ years",
      photo: "https://images.apollo247.in/doctors/345a9d40-1064-4a51-93cc-ac29968c22e5-1716609919412.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-ms-rajeshwari-luther-345a9d40-1064-4a51-93cc-ac29968c22e5?source=Listing_Page",
      price: 2500,
      phone: "+91 9876543210",
      email: "rajeshwari.luther@example.com"
    },
    {
      name: "Dr. Sapna Zarwal",
      specialty: "Psychologist",
      experience: "20+ years",
      photo: "https://images.apollo247.in/doctors/7455cb9b-79a2-452b-b05a-1c63d844c037-1727786499043.jpg?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-sapna-zarwal-7455cb9b-79a2-452b-b05a-1c63d844c037?source=Listing_Page",
      price: 1800,
      phone: "+91 9876543210",
      email: "sapna.zarwal@example.com"
    },
    {
      name: "Dr. Eric Miller",
      specialty: "Psychologist",
      experience: "3+ years",
      photo: "https://images.apollo247.in/doctors/28c4f565-4488-4c2c-aff9-f6f26ef16990-1710258906017.png?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-eric-miller-28c4f565-4488-4c2c-aff9-f6f26ef16990?source=Listing_Page",
      price: 1200,
      phone: "+91 9876543210",
      email: "eric.miller@example.com"
    },
    {
      name: "Ms. Sharmila Mazumdar",
      specialty: "Psychologist",
      experience: "15+ years",
      photo: "https://images.apollo247.in/doctors/da40cb91-e437-4f0f-ab4f-45ed490742b7-1710258902865.png?tr=w-375,h-150,c-at_max,f-auto",
      profile: "https://www.apollo247.com/doctors/dr-ms-sharmila-mazumdar-da40cb91-e437-4f0f-ab4f-45ed490742b7?source=Listing_Page",
      price: 1500,
      phone: "+91 9876543210",
      email: "sharmila.mazumdar@example.com"
    },
  ]

  const handleSendMail = (doctor) => {
    let formattedText =''
    props.qaAssignments.slice(1).forEach((entry, index) => {
      const userId = entry.user_id || '';
      const createdAt = entry.created_at ? new Date(entry.created_at).toLocaleString() : '';
      const questions = (entry.question && entry.question[0]) || {};
      const severityScores = (entry.answer && entry.answer[0]?.result?.['Severity Scores']) || [];
      const stressLevel = (entry.answer && entry.answer[0]?.result?.['Stress Level']) || '';
      const enhancedAnswers = (entry.enhanced_answer && entry.enhanced_answer[0]) || {};

      const summary = entry.summary || {};
      const core = summary.core_concerns || {};
      const progress = summary.progress || {};
      // Ensure strengths and challenges are arrays
      const strengths = Array.isArray(progress.strengths) ? progress.strengths : (progress.strengths ? [progress.strengths] : []);
      const challenges = Array.isArray(progress.challenges) ? progress.challenges : (progress.challenges ? [progress.challenges] : []);
      const actionItems = summary.action_items?.immediate || {};
      const followUp = summary.follow_up || {};

      formattedText += `\n======= Entry ${index + 1} =======\n`;
      formattedText += `User ID: ${userId}\n`;
      formattedText += `Created At: ${createdAt}\n`;

      formattedText += `\nQuestions:\n`;
      Object.entries(questions).forEach(([qIndex, question]) => {
        formattedText += `  Q${qIndex}: ${question || ''}\n`;
      });

      formattedText += `\nSeverity Scores: ${severityScores.join(', ') || ''}\n`;
      formattedText += `Stress Level: ${stressLevel}\n`;

      formattedText += `\nEnhanced Answers:\n`;
      Object.entries(enhancedAnswers).forEach(([aIndex, answer]) => {
        formattedText += `  A${aIndex}: ${answer || ''}\n`;
      });

      formattedText += `\n--- Summary ---\n`;
      formattedText += `Primary Concern: ${core.primary || ''}\n`;
      formattedText += `Secondary Concerns: ${(core.secondary || []).join(', ')}\n`;
      formattedText += `Risk Level: ${core.risk_level || ''}\n`;

      formattedText += `\nStrengths: ${strengths.join(', ')||''}\n`;
      formattedText += `Challenges: ${challenges.join(', ')||''}\n`;

      formattedText += `\nImmediate Actions:\n`;
      Object.entries(actionItems).forEach(([domain, items]) => {
        formattedText += `  ${domain}: ${items.join(', ') || ''}\n`;
      });

      formattedText += `\nFollow-up Timing: ${followUp.recommended_timing || ''}\n`;
      formattedText += `Follow-up Focus Areas: ${(followUp.focus_areas || []).join(', ')}\n`;

      formattedText += `Follow-up Goals:\n`;
      Object.entries(followUp.goals || {}).forEach(([domain, goals]) => {
        formattedText += `  ${domain}: ${goals.join(', ') || ''}\n`;
      });

      formattedText += `Continuity Notes: ${summary.continuity_notes || ''}\n`;
      formattedText += `Crisis Present: ${summary.crisis_indicators?.present === true ? 'Yes' : 'No'}\n`;
    });


    setSelectedDoctor(doctor)
    setEmailSubject(`Report Validation Request with ${doctor.name}`)
    setEmailBody(
      `Dear ${doctor.name},\n\nI hope you are doing well. I am writing to kindly request your review and validation of the attached report. Your expert opinion would be greatly appreciated.\nPlease let me know if any additional information is needed from my side.\n\nThank you,\n${props.name}\n${props.email}\n\n${formattedText}`,
    )
    setShowEmailForm(true)
  }

  const handleSendEmail = async () => {
    // In a real application, you would send the email via an API
    // For now, we'll just show an alert
    // alert(`Email to ${selectedDoctor?.name} will be sent!\n\nSubject: ${emailSubject}\n\nBody: ${emailBody}`)
    

    let res = await fetch('/api/sendemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: selectedDoctor?.email,
        subject: emailSubject,
        body: emailBody,
      }),
    })
    if (res.status === 200) {
      toast.success(`Email sent to ${selectedDoctor?.name}!`)
    }
    else {
      toast.error(`Failed to send email to ${selectedDoctor?.name}. Please try again.`)
    }
    setShowEmailForm(false)
  }

  const handleBackToList = () => {
    setShowEmailForm(false)
  }

  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary mr-2 bg-slate-100 text-purple-600 outline outline-purple-600 outline-1 hover:bg-purple-600 hover:text-white">
          <AlertCircle className="h-4 w-4 mr-1 inline" />
          <span className='hidden md:inline'>Validate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        {!showEmailForm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">Our Medical Specialists</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.photo || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{doctor.name}</h3>
                    <p className="text-muted-foreground">{doctor.specialty} ({doctor.experience})</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleSendMail(doctor)}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Mail</span>
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Email to {selectedDoctor?.name}</h2>
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To:</Label>
              <Input readOnly id="to" value={selectedDoctor?.email || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject:</Label>
              <Input readOnly id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message:</Label>
              <Textarea readOnly id="body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleBackToList}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>Send Email</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

  )
}
