'use client'
import ProtectedRoutes from '@/hooks/ProtectedRoutes';
import React from 'react'
import UserCard from './_components/UserCard';

export default function Dashboard() {
  return (
    <ProtectedRoutes>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <UserCard />
      </div>
    </ProtectedRoutes>
  )
}
