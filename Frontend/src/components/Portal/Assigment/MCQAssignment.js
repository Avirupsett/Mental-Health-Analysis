'use client'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MCQAssignment() {
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      question: "What is your current Occupation?",
      options: ["Corporate", "Business", "Student", "Housewife","Others"],
      correctAnswer: ""
    },
    {
      question: "Are you self employed?",
      options: ["Yes","No"],
      correctAnswer: "Mars"
    },
    {
      question: "Do you have a family history of mental illness?",
      options: ["Yes","No"],
      correctAnswer: ""
    },
    {
      question: "Have you sought treatment for a mental health condition?",
      options: ["Yes","No"],
      correctAnswer: ""
    },
    {
      question: "How much time do you spend on Indoor?",
      options: ["1-14 Days","15-30 Days","30-61 Days","More than 2 months","Go out Every Day"],
      correctAnswer: ""
    },
    {
      question: "Have you experienced any significant changes in your daily habits recently?",
      options: ["Yes","No","Maybe"],
      correctAnswer: ""
    },
    {
      question: "Do you have a personal history of mental health issues?",
      options: ["Yes","No","Maybe"],
      correctAnswer: ""
    },
    {
      question: "Have you experienced frequent mood swings recently?",
      options: ["Low","Medium","High"],
      correctAnswer: ""
    },
    {
      question: "Are you currently struggling to cope with stress or difficult situations?",
      options: ["Yes","No"],
      correctAnswer: ""
    },
    {
      question: "Have you lost interest in your work or daily activities?",
      options: ["Yes","No","Maybe"],
      correctAnswer: ""
    },
    {
      question: "Have you noticed difficulties in social interactions or relationships?",
      options: ["Yes","No","Maybe"],
      correctAnswer: ""
    },
    {
      question: "Would you bring up a mental health issue with a potential employer in an interview?",
      options: ["Yes","No","Maybe"],
      correctAnswer: ""
    },
    {
      question: "Are you aware of the care options available for mental health treatment?",
      options: ["Yes","No","Not Sure"],
      correctAnswer: ""
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    let score = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++
      }
    })
    alert(`Your Stress level is __%`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* <header className="bg-gray-800 text-white p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-mono">project planner</h1>
          <div className="mt-2 h-32 md:h-48 bg-cover bg-center rounded-lg" style={{backgroundImage: "url('/placeholder.svg?height=200&width=800')"}}></div>
        </div>
      </header> */}
      <main className="container mx-auto px-2 sm:px-4 flex justify-center ">
        <Card className="w-full max-w-3xl !mt-4 sm:!mt-8 !mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-medium text-center font-mono">Assignment Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-7 !mb-8">
              {questions.map((q, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{index + 1}. {q.question}</h3>
                  <RadioGroup
                    onValueChange={(value) => setAnswers({...answers, [index]: value})}
                    className="grid gap-1"
                  >
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-gray-800">
                        <RadioGroupItem value={option} id={`q${index}-option${optionIndex}`} />
                        <Label htmlFor={`q${index}-option${optionIndex}`} className="flex-grow cursor-pointer text-[16px] sm:text-lg">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-center">
                <Button type="submit" size="lg" className="mt-4 px-8 py-2 text-lg">Submit Answers</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}