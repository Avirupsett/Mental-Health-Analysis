import MCQAssignment from '../../../components/Portal/Assigment/MCQAssignment'
import React from 'react'

export const generateMetadata = async ({ params }) => {
  return {
    title: 'Mental Health Assessment',
    description: 'Complete your personalized mental health questionnaire and receive feedback.',
    alternates: {
      canonical: `${process.env.URL}/portal/assignment`
    }
  }
}

export default function Assignment() {
  return (
    <MCQAssignment/>
  )
}
