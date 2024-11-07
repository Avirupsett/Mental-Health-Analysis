'use client'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import StressLevelChartModal from './StressLevelChartModal';
import { toast } from 'sonner'
import { NotebookText, ScrollText, SendHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import GenerateQuestion from './GenerateQuestion'

export default function MCQAssignment() {
  const [answers, setAnswers] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stressLevel, setStressLevel] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const questions = [
    {
      question: "What is your current Occupation?",
      options: ["Corporate", "Business", "Student", "Housewife", "Others"],
      correctAnswer: "",
      tag: "Occupation"
    },
    {
      question: "Do you have a family history of mental illness?",
      options: ["Yes", "No"],
      correctAnswer: "",
      tag: "family_history"
    },
    {
      question: "Have you sought treatment for a mental health condition?",
      options: ["Yes", "No"],
      correctAnswer: "",
      tag: "treatment"
    },
    {
      question: "How much time do you spend on Indoor?",
      options: ["1-14 days", "15-30 days", "30-61 days", "More than 2 months", "Go out Every day"],
      correctAnswer: "",
      tag: "Days_Indoors"
    },
    {
      question: "Have you experienced any significant changes in your daily habits recently?",
      options: ["Yes", "No", "Maybe"],
      correctAnswer: "",
      tag: "Changes_Habits"
    },
    {
      question: "Do you have a personal history of mental health issues?",
      options: ["Yes", "No", "Maybe"],
      correctAnswer: "",
      tag: "Mental_Health_History"
    },
    {
      question: "Have you experienced frequent mood swings recently?",
      options: ["Low", "Medium", "High"],
      correctAnswer: "",
      tag: "Mood_Swings"
    },
    {
      question: "Are you currently struggling to cope with stress or difficult situations?",
      options: ["Yes", "No"],
      correctAnswer: "",
      tag: "Coping_Struggles"
    },
    {
      question: "Have you lost interest in your work or daily activities?",
      options: ["Yes", "No", "Maybe"],
      correctAnswer: "",
      tag: "Work_Interest"
    },
    {
      question: "Have you noticed difficulties in social interactions or relationships?",
      options: ["Yes", "No", "Maybe"],
      correctAnswer: "",
      tag: "Social_Weakness"
    },
    {
      question: "Would you bring up a mental health issue with a potential employer in an interview?",
      options: ["Yes", "No", "Maybe"],
      correctAnswer: "",
      tag: "mental_health_interview"
    },
    {
      question: "Are you aware of the care options available for mental health treatment?",
      options: ["Yes", "No", "Not sure"],
      correctAnswer: "",
      tag: "care_options"
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = {}
    let allAnswered = true
    setIsLoading(true);

    questions.forEach((q, index) => {
      if (answers[index] === undefined) {
        allAnswered = false
      } else {
        data[q.tag] = answers[index]
      }
    })

    if (!allAnswered) {
      toast.error(`Please answer all the questions`)
      setIsLoading(false)
      return
    }
    const loadingToast = toast.loading('Fetching results...');

    // Create an AbortController
    const controller = new AbortController();
    const signal = controller.signal;

    // Set up a timeout
    const timeoutId = setTimeout(() => {
      controller.abort(); // Abort the fetch request
      toast.dismiss(loadingToast);
      toast.error('Request is taking too long. Please try again.');
      setIsLoading(false);
    }, 10000); // 10 seconds

    try {
      const response = await fetch('/api/predict/qamodel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: signal
      });
      clearTimeout(timeoutId);
      toast.dismiss(loadingToast);
      if (response.status === 200) {
        // toast.success('Results fetched successfully')
        const result = await response.json()
        setStressLevel(result['Stress Level'])
        setShowModal(true)

        const isGenerated = await GenerateQuestion()
        if (isGenerated==false) {
          const isGenerated2 = await GenerateQuestion()
          setIsDisabled(isGenerated2)
        }
        else {
          setIsDisabled(isGenerated)
        }
        // alert(`Your Stress level is ${JSON.stringify(result)}`)
      }
      if (response.status === 500) {
        toast.error('An error occurred. Please try again later.');
        setIsLoading(false)
        return;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.name === 'AbortError') {
        // Request was aborted
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}

      className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* <header className="bg-gray-800 text-white p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-mono">project planner</h1>
          <div className="mt-2 h-32 md:h-48 bg-cover bg-center rounded-lg" style={{backgroundImage: "url('/placeholder.svg?height=200&width=800')"}}></div>
        </div>
      </header> */}
      <main className="container mx-auto px-2 sm:px-4 flex justify-center ">
        <Card className="w-full bg-white bg-opacity-80 text-gray-800 max-w-3xl !mt-4 sm:!mt-8 !mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-2xl md:text-3xl font-medium text-center font-mono"><div className="flex items-center justify-center"><NotebookText className='mr-3 sm:mr-4 text-purple-600 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9' />Assignment Questions</div></CardTitle>

          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-7 !mb-8">
              {questions.map((q, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.95,margin: '0px 0px 100px 0px'  }}
                  key={index} className="p-4  dark:border-gray-700 rounded-lg shadow-md  hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{index + 1}. {q.question}</h3>
                  <RadioGroup
                    onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
                    className="grid gap-1"
                    name={`question-${index}`}
                    id={`question-${index}`}
                  >
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 hover:bg-opacity-80 dark:hover:bg-gray-800">
                        <RadioGroupItem value={option} id={`q${index}-option${optionIndex}`} />
                        <Label htmlFor={`q${index}-option${optionIndex}`} className="flex-grow cursor-pointer text-[16px] sm:text-lg">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              ))}
              <div className="flex justify-center">
                <Button disabled={isLoading} type="submit" size="lg" className="mt-4 px-8 !h-14 text-lg flex items-center justify-center"><span>Submit Answers</span><SendHorizontal className='ml-4 text-md' /></Button>
                <StressLevelChartModal showModal={showModal} setShowModal={setShowModal} stressLevel={stressLevel} isDisabled={isDisabled} />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </motion.div>
  )
}
