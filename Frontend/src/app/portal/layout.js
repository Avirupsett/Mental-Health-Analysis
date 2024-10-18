import Sidebar from '../../components/Sidebar/Sidebar' 
import React from 'react'
import {
	getUser,
	signOut,
} from "@workos-inc/authkit-nextjs";

export default async function layout({ children }) {
  const { user } = await getUser();
  async function handleSignOut() {
    'use server'
    await signOut();
  }
  return (
    <><Sidebar content={children} user={user} signOut={handleSignOut}/></>
  )
}
