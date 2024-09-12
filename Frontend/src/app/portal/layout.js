import Sidebar from '../../components/Sidebar/Sidebar' 
import React from 'react'

export default function layout({ children }) {
  return (
    <><Sidebar content={children}/></>
  )
}
