'use client'
import React from 'react'
import { useParams } from 'next/navigation'

const Page: React.FC = () => {
    const { id } = useParams();
  return (
    <div>
      Hello wanna see the vanacy chart ??
      Well the room id is {id}
    </div>
  )
}

export default Page
