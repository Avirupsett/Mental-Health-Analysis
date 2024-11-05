import React from 'react'
import Profile from '../../../components/Portal/Profile/Profile'

export const generateMetadata = async ({ params }) => {
  return {
    title: 'Profile',
    description: 'Your Profile Information',
    alternates: {
      canonical: `${process.env.URL}/portal/profile`
    }
  }
}

export default function ProfilePage() {
  return (
    <Profile/>
  )
}
