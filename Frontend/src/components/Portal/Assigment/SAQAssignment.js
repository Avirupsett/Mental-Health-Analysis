'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import StressLevelChartModal from './StressLevelChartModal';
import { toast } from 'sonner'
import { Check, Circle, CircleCheck, CircleCheckBig, Languages, NotebookText, ScrollText, SendHorizontal, Speaker, Volume, Volume1Icon, Volume2Icon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Textarea } from '../../ui/textarea'
import GenerateQuestion from './GenerateQuestion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

export default function MCQAssignment(props) {
  const [answers, setAnswers] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stressLevel, setStressLevel] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [language, setLanguage] = useState('en')
  const [translatedQuestions, setTranslatedQuestions] = useState(props.questions)
  const [playingQuestion, setPlayingQuestion] = useState(null);
  const audioRef = useRef(null);

  const getLocale = () => {
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('locale')
      return storedLocale || 'en'
    }
    return 'en'
  }

  const translate = async (lang, questions) => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/translate?target_language=${lang}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
      })

      if (!response.ok) {
        toast.dismiss()
        toast.error(`An error occurred. Please try again later.`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      try {
        toast.dismiss()
        toast.success('Translated successfully')
        const data = JSON.parse(text)
        return data
      } catch (e) {
        console.error('Failed to parse JSON:', text)
        throw new Error('Invalid JSON response from server')
      }
    } catch (error) {
      toast.dismiss()
      toast.error(`An error occurred. Please try again later.`)
      console.error('Translation error:', error)
      return questions // Fallback to original questions on error
    }

  }

  useEffect(() => {
    const locale = getLocale()
    if (locale !== 'en') {
      setLanguage(locale)
      toast.loading('Translating questions...')
      translate(locale, props.questions).then(translatedQuestions => {
        setTranslatedQuestions(translatedQuestions)
      })
    }
  }, [])

  const setLocale = async (locale) => {
    if (typeof window !== 'undefined') {
      toast.loading('Translating questions...')
      setLanguage(locale)
      await translate(locale, props.questions).then(translatedQuestions => {
        setTranslatedQuestions(translatedQuestions)
      })
      localStorage.setItem('locale', locale)
    }
  }

  const textToSpeech = async (text, language, questionNumber) => {

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio
      setPlayingQuestion(questionNumber);
      audio.play();

      // Reset the icon color when audio ends
      audio.onended = () => {
        setPlayingQuestion(null);
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    let data = {}
    let allAnswered = true
    setIsLoading(true);
    let translatedData = {}


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

    if (language !== 'en') {
      toast.loading('Translating data...')
      translatedData = await translate('en', data)
    }
    else {
      translatedData = data
    }

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
      if (Object.keys(translatedData).length > 0) {

        const loadingToast = toast.loading('Fetching results...');

        const response = await fetch('/api/predict/sentimentalmodel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(translatedData),
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
          if (isGenerated == false) {
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
          <CardHeader className="flex justify-between items-center flex-row pb-1 sm:pb-6">
            <CardTitle className="text-2xl sm:text-2xl md:text-3xl font-medium text-center font-mono flex-grow mr-[-30px]">
              <div className="flex items-center justify-center">
                <NotebookText className='mr-3 sm:mr-4 text-purple-600 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9' />
                <span className='hidden sm:block'>Assignment &nbsp;</span>Questions
              </div>
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className='flex items-center justify-center'>
                    <Languages className="h-6 w-6" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" >
                <DropdownMenuItem onClick={() => setLocale('en')}>
                  {language === 'en' ? (
                    <CircleCheckBig className="mr-2 h-4 w-4" />
                  ) : (
                    <Circle className="mr-2 h-4 w-4" />
                  )}
                  English
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocale('hi')}>
                  {language === 'hi' ? (
                    <CircleCheckBig className="mr-2 h-4 w-4" />
                  ) : (
                    <Circle className="mr-2 h-4 w-4" />
                  )}
                  हिंदी
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocale('bn')}>
                  {language === 'bn' ? (
                    <CircleCheckBig className="mr-2 h-4 w-4" />
                  ) : (
                    <Circle className="mr-2 h-4 w-4" />
                  )}
                  বাংলা
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-7 !mb-8">
              {Object.entries(translatedQuestions).map(([questionNumber, questionText]) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.95, margin: '0px 0px 100px 0px' }}
                  key={questionNumber} className="p-4  dark:border-gray-700 rounded-lg shadow-md  hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl sm:!leading-8 font-semibold mb-3 flex items-center justify-between">{questionNumber}. {questionText} <span className={`cursor-pointer inline-block pl-2 ${playingQuestion === questionNumber ? 'pointer-events-none' : ''}`} onClick={() => textToSpeech(questionText, language, questionNumber)}><Volume2Icon className={`h-5 w-5 ${playingQuestion === questionNumber ? 'text-purple-600' : ''}`} /></span></h3>
                  <div className="my-5 sm:mx-2">
                    <Textarea
                      value={answers[questionNumber] || ''}
                      onChange={(e) => setAnswers({ ...answers, [questionNumber]: e.target.value })}
                      className="w-full p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-transparent"
                      rows={4}
                      id={`question-${questionNumber}`}
                      placeholder={language === 'bn' ? `উত্তর দিন...` : language === 'hi' ? `उत्तर दो...` : `Enter your answer here...`}
                    />
                  </div>
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
