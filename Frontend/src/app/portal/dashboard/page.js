import React from 'react'
import DashboardUI from '../../../components/Portal/Dashboard/DashboardUI'

export const generateMetadata = async ({ params }) => {
  return {
    title: 'Dashboard',
    description: 'Your personalized dashboard to track your mental health journey.',
    alternates: {
      canonical: `${process.env.URL}/portal/dashboard`
    }
  }
}
export default function DashboardPage() {
  return (
      <DashboardUI />
  )
}
