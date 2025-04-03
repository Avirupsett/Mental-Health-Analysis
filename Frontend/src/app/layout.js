import { Roboto_Slab, Mulish } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import { ViewTransitions } from 'next-view-transitions'
import VoiceAssistantWrapper from '../components/VoiceAssistantWrapper';

const roboto_Slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    template: '%s | Mentrix - Mental Health Monitoring System',
    default: 'Mentrix'
  },
  description: 'Professional mental health monitoring system offering personalized assessments, real-time feedback, and progress tracking for better mental wellbeing.',
  metadataBase: new URL('https://mentrix-app.vercel.app'),
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'mental health monitoring',
    'mental health assessment',
    'psychological questionnaires',
    'mental health tracking',
    'mental wellness platform',
    'personalized mental health',
    'mental health progress',
    'daily mental health',
    'mental health feedback',
    'psychological assessment tool',
    'mentrix',
    'mentrix-app'
  ],
  authors: [ { name: 'Avirup Sett', url: 'https://avirupsett.netlify.app' }],
  creator: 'Avirup Sett',
  publisher: 'Avirup Sett',
  formatDetection: {
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mentrix-app.vercel.app',
    title: 'Mentrix - Personalized Mental Health Monitoring System',
    description: 'Track and improve your mental wellbeing with personalized assessments and feedback.',
    images: [
      {
        url: `${process.env.URL}/homepage.png`,
        width: 1918,
        height: 967,
        alt: 'Mentrix',
        type: 'image/png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export default async function RootLayout({ children }) {
  return (
    <ViewTransitions>
    <html lang="en" className={`${mulish.variable} ${roboto_Slab.variable}`}>
      <body >
        
          <Toaster position="top-center" richColors duration={3000} className="font-mono" toastOptions={{className: "text-sm sm:text-base"}}/>
        {children}
        <VoiceAssistantWrapper />
      </body>
    </html>
    </ViewTransitions>
  );
}
