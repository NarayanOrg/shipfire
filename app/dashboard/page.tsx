import ProtectedRoutes from '@/hooks/ProtectedRoutes';
import React from 'react'

export default function Dashboard() {
  return (
    <ProtectedRoutes>
      <div>Dashboard</div>
    </ProtectedRoutes>
  )
}
