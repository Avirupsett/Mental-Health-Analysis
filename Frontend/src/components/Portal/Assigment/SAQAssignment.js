'use client'
import { useState } from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import StressLevelChartModal from './StressLevelChartModal';
import { toast } from 'sonner'
import { NotebookText, ScrollText, SendHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { Textarea } from '../../ui/textarea'

export default function MCQAssignment(props) {
  const [answers, setAnswers] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stressLevel, setStressLevel] = useState(0)



  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = {}
    let allAnswered = true
    setIsLoading(true);

    Object.entries(props.questions).forEach(([questionNumber, questionText]) => {
      if (answers[questionNumber] === undefined) {
        allAnswered = false
      } else {
        data[questionNumber] = answers[questionNumber]
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
    }, 20000); // 20 seconds

    try {
      const response = await fetch('/api/predict/sentimentalmodel', {
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
        // Generate summary for the new QA
        const summaryResponse = await fetch(`/api/predict/generatesummary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!summaryResponse.ok) {
          console.error('Error generating summary:', await summaryResponse.text());
        }

        const generateQuestionResponse = await fetch(`/api/predict/generatequestion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!generateQuestionResponse.ok) {
          console.error('Error generating question:', await generateQuestionResponse.text());
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
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-medium text-center font-mono">

              <div className="flex items-center justify-center"><NotebookText className='mr-3 sm:mr-4 text-purple-600 h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9' />

                Assignment Questions</div></CardTitle>

          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-7 !mb-8">
              {Object.entries(props.questions).map(([questionNumber, questionText]) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.95 }}
                  key={questionNumber} className="p-4  dark:border-gray-700 rounded-lg shadow-md  hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl !leading-8 font-semibold mb-3">{questionNumber}. {questionText}</h3>
                  <div className="my-5 sm:mx-2">
                    <Textarea
                      value={answers[questionNumber] || ''}
                      onChange={(e) => setAnswers({ ...answers, [questionNumber]: e.target.value })}
                      className="w-full p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-transparent"
                      rows={4}
                      id={`question-${questionNumber}`}
                      placeholder="Enter your answer here..."
                    />
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-center">
                <Button disabled={isLoading} type="submit" size="lg" className="mt-4 px-8 !h-14 text-lg flex items-center justify-center"><span>Submit Answers</span><SendHorizontal className='ml-4 text-md' /></Button>
                <StressLevelChartModal showModal={showModal} setShowModal={setShowModal} stressLevel={stressLevel} />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </motion.div>
  )
}
