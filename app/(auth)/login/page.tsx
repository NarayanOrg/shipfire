'use client'
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  return (
    <div>LoginPage  {redirect}</div>
  )
}
