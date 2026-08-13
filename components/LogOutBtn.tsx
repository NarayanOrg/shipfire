'use client'
import { Button } from './ui/button';
import { useAuth } from '@/stores/authAuthStore';

export default function LogOutBtn() {
    const { logout } = useAuth()
  return (
    <Button onClick={logout} variant={'outline'} size={'sm'}>Sign out</Button>
  )
}
