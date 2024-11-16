'use client'
import { useRef, useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import StressLevelChartModal from './StressLevelChartModal';
import { toast } from 'sonner'
import { Circle, CircleCheckBig, Languages, NotebookText, ScrollText, SendHorizontal, Volume2Icon } from 'lucide-react'
import { motion } from 'framer-motion'
import GenerateQuestion from './GenerateQuestion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

export default function MCQAssignment() {
  const [answers, setAnswers] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stressLevel, setStressLevel] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [playingQuestion, setPlayingQuestion] = useState(null);
  const [translatedQuestions, setTranslatedQuestions] = useState([])
  const [language, setLanguage] = useState('en')
  const audioRef = useRef(null);

  const getLocale = () => {
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('locale')
      return storedLocale || 'en'
    }
    return 'en'
  }

  useEffect(() => {
    const locale = getLocale()
    if (locale !== 'en') {
      setLanguage(locale)
      translate(locale, questions).then(translatedQuestions => {
        setTranslatedQuestions(translatedQuestions)
      })
    }
  }, [])

  // Add translation function
  const translate = async (lang, questions) => {
    // Hardcoded translations example
    const translations = {
      'hi': {
        questions: [
          {
            "question": "आपका वर्तमान पेशा क्या है?",
            "options": ["कॉर्पोरेट", "व्यवसाय", "छात्र", "गृहिणी", "अन्य"],
            "correctAnswer": "",
            "tag": "Occupation"
          },
          {
            "question": "क्या आपके परिवार में मानसिक बीमारी का इतिहास है?",
            "options": ["हाँ", "नहीं"],
            "correctAnswer": "",
            "tag": "family_history"
          },
          {
            "question": "क्या आपने मानसिक स्वास्थ्य स्थिति के लिए उपचार लिया है?",
            "options": ["हाँ", "नहीं"],
            "correctAnswer": "",
            "tag": "treatment"
          },
          {
            "question": "आप घर के अंदर कितना समय बिताते हैं?",
            "options": ["1-14 दिन", "15-30 दिन", "30-61 दिन", "2 महीने से अधिक", "हर दिन बाहर जाते हैं"],
            "correctAnswer": "",
            "tag": "Days_Indoors"
          },
          {
            "question": "क्या हाल ही में आपकी दैनिक आदतों में कोई महत्वपूर्ण बदलाव हुआ है?",
            "options": ["हाँ", "नहीं", "शायद"],
            "correctAnswer": "",
            "tag": "Changes_Habits"
          },
          {
            "question": "क्या आपका मानसिक स्वास्थ्य से जुड़ा कोई व्यक्तिगत इतिहास है?",
            "options": ["हाँ", "नहीं", "शायद"],
            "correctAnswer": "",
            "tag": "Mental_Health_History"
          },
          {
            "question": "क्या हाल ही में आपने बार-बार मूड स्विंग्स अनुभव किए हैं?",
            "options": ["कम", "मध्यम", "उच्च"],
            "correctAnswer": "",
            "tag": "Mood_Swings"
          },
          {
            "question": "क्या आप वर्तमान में तनाव या कठिन परिस्थितियों से निपटने में संघर्ष कर रहे हैं?",
            "options": ["हाँ", "नहीं"],
            "correctAnswer": "",
            "tag": "Coping_Struggles"
          },
          {
            "question": "क्या आपने अपने काम या दैनिक गतिविधियों में रुचि खो दी है?",
            "options": ["हाँ", "नहीं", "शायद"],
            "correctAnswer": "",
            "tag": "Work_Interest"
          },
          {
            "question": "क्या आपने सामाजिक संपर्क या संबंधों में कठिनाइयाँ देखी हैं?",
            "options": ["हाँ", "नहीं", "शायद"],
            "correctAnswer": "",
            "tag": "Social_Weakness"
          },
          {
            "question": "क्या आप नौकरी के साक्षात्कार में मानसिक स्वास्थ्य के मुद्दे पर चर्चा करेंगे?",
            "options": ["हाँ", "नहीं", "शायद"],
            "correctAnswer": "",
            "tag": "mental_health_interview"
          },
          {
            "question": "क्या आप मानसिक स्वास्थ्य उपचार के लिए उपलब्ध देखभाल विकल्पों के बारे में जानते हैं?",
            "options": ["हाँ", "नहीं", "पक्का नहीं"],
            "correctAnswer": "",
            "tag": "care_options"
          }
        ]
        
      },
      'bn': {
        questions:[
          {
            "question": "আপনার বর্তমান পেশা কী?",
            "options": ["কর্পোরেট", "ব্যবসা", "ছাত্র", "গৃহিণী", "অন্যান্য"],
            "correctAnswer": "",
            "tag": "Occupation"
          },
          {
            "question": "আপনার পরিবারে কি মানসিক অসুস্থতার ইতিহাস রয়েছে?",
            "options": ["হ্যাঁ", "না"],
            "correctAnswer": "",
            "tag": "family_history"
          },
          {
            "question": "আপনি কি কখনো মানসিক স্বাস্থ্যের জন্য চিকিৎসা নিয়েছেন?",
            "options": ["হ্যাঁ", "না"],
            "correctAnswer": "",
            "tag": "treatment"
          },
          {
            "question": "আপনি কতদিন ধরে ঘরে সময় কাটান?",
            "options": ["১-১৪ দিন", "১৫-৩০ দিন", "৩০-৬১ দিন", "২ মাসের বেশি", "প্রতিদিন বাইরে যান"],
            "correctAnswer": "",
            "tag": "Days_Indoors"
          },
          {
            "question": "সম্প্রতি কি আপনার দৈনন্দিন অভ্যাসে উল্লেখযোগ্য পরিবর্তন হয়েছে?",
            "options": ["হ্যাঁ", "না", "সম্ভবত"],
            "correctAnswer": "",
            "tag": "Changes_Habits"
          },
          {
            "question": "আপনার ব্যক্তিগত মানসিক স্বাস্থ্যের ইতিহাস কি আছে?",
            "options": ["হ্যাঁ", "না", "সম্ভবত"],
            "correctAnswer": "",
            "tag": "Mental_Health_History"
          },
          {
            "question": "সম্প্রতি কি আপনি ঘন ঘন মেজাজ পরিবর্তন অনুভব করছেন?",
            "options": ["কম", "মাঝারি", "উচ্চ"],
            "correctAnswer": "",
            "tag": "Mood_Swings"
          },
          {
            "question": "আপনি কি বর্তমানে চাপ বা কঠিন পরিস্থিতি সামাল দিতে সমস্যায় পড়ছেন?",
            "options": ["হ্যাঁ", "না"],
            "correctAnswer": "",
            "tag": "Coping_Struggles"
          },
          {
            "question": "আপনি কি আপনার কাজ বা দৈনন্দিন কার্যকলাপে আগ্রহ হারিয়েছেন?",
            "options": ["হ্যাঁ", "না", "সম্ভবত"],
            "correctAnswer": "",
            "tag": "Work_Interest"
          },
          {
            "question": "আপনি কি সামাজিক যোগাযোগ বা সম্পর্ক বজায় রাখতে সমস্যা অনুভব করছেন?",
            "options": ["হ্যাঁ", "না", "সম্ভবত"],
            "correctAnswer": "",
            "tag": "Social_Weakness"
          },
          {
            "question": "আপনি কি চাকরির সাক্ষাৎকারে মানসিক স্বাস্থ্য নিয়ে কথা বলবেন?",
            "options": ["হ্যাঁ", "না", "সম্ভবত"],
            "correctAnswer": "",
            "tag": "mental_health_interview"
          },
          {
            "question": "আপনি কি মানসিক স্বাস্থ্য চিকিৎসার জন্য উপলব্ধ যত্নের বিকল্পগুলি সম্পর্কে সচেতন?",
            "options": ["হ্যাঁ", "না", "নিশ্চিত নই"],
            "correctAnswer": "",
            "tag": "care_options"
          }
        ]
        
      }
    }

    if (lang === 'en') {
      return questions // Return original questions for English
    }

    // Return translated questions if available, otherwise return original
    return translations[lang]?.questions || questions
  }

  const setLocale = async (locale) => {
    if (typeof window !== 'undefined') {
      setLanguage(locale)
      const translated = await translate(locale, questions)
      console.log(translated)
      setTranslatedQuestions(translated)
      localStorage.setItem('locale', locale)
    }
  }
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
        let answer = answers[index]
        if (language !== 'en') {
          // Create a reverse mapping for translations
          const reverseTranslations = {
            'hi': {
              "कॉर्पोरेट": "Corporate",
              "व्यवसाय": "Business",
              "छात्र": "Student",
              "गृहिणी": "Housewife",
              "अन्य": "Others",
              "हाँ": "Yes",
              "नहीं": "No",
              "शायद": "Maybe",
              "1-14 दिन": "1-14 days",
              "15-30 दिन": "15-30 days",
              "30-61 दिन": "30-61 days",
              "2 महीने से अधिक": "More than 2 months",
              "हर दिन बाहर जाते हैं": "Go out Every day",
              "कम": "Low",
              "मध्यम": "Medium",
              "उच्च": "High",
              "पक्का नहीं": "Not sure"
            },
            'bn': {
              "কর্পোরেট": "Corporate",
              "ব্যবসা": "Business",
              "ছাত্র": "Student",
              "গৃহিণী": "Housewife",
              "অন্যান্য": "Others",
              "হ্যাঁ": "Yes",
              "না": "No",
              "সম্ভবত": "Maybe",
              "১-১৪ দিন": "1-14 days",
              "১৫-৩০ দিন": "15-30 days",
              "৩০-৬১ দিন": "30-61 days",
              "২ মাসের বেশি": "More than 2 months",
              "প্রতিদিন বাইরে যান": "Go out Every day",
              "কম": "Low",
              "মাঝারি": "Medium",
              "উচ্চ": "High",
              "নিশ্চিত নই": "Not sure"
            }
            
          }
          answer = reverseTranslations[language][answer] || answer
        }
        data[q.tag] = answer
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
            <CardTitle className="text-2xl sm:text-2xl md:text-3xl font-medium text-center font-mono flex-grow mr-[-30px]"><div className="flex items-center justify-center"><NotebookText className='mr-3 sm:mr-4 text-purple-600 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9' /><span className='hidden sm:block'>Assignment &nbsp;</span>Questions</div></CardTitle>

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
              {(language === 'en' ? questions : translatedQuestions).map((q, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.95, margin: '0px 0px 100px 0px' }}
                  key={index} className="p-4  dark:border-gray-700 rounded-lg shadow-md  hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center justify-between">{index + 1}. {q.question}<span className="cursor-pointer inline-block pl-2" onClick={() => textToSpeech(q.question, "en", index + 1)}><Volume2Icon className={`h-5 w-5 ${playingQuestion === index + 1 ? 'text-purple-600' : ''}`} /></span></h3>
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
