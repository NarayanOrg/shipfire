"use client"
import { Button } from "@/components/ui/button"
import { auth } from "@/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = React.useState<boolean | null>(null)
  const [authError, setAuthError] = React.useState<string | null>(null)
  const router = useRouter()
  const currentPath = usePathname()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        if (!user) {
          setAuthorized(false)
          router.push(`/login?redirect=${currentPath}`)
          return
        }

        if (!user.emailVerified) {
          setAuthorized(false)
          router.push(`/verify-email?redirect=${currentPath}`)
          return
        }

        setAuthError(null)
        setAuthorized(true)
      },
      (err) => {
        console.error("Error loading page", err.message)
        setAuthError(err.message || "Error loading page")
        setAuthorized(false)
      }
    )

    return () => unsubscribe()
  }, [router, currentPath])

  if (authError) {
    return (
      <main className="flex h-screen flex-col items-center justify-center space-y-4 bg-background">
        <span>{authError}</span>
        <Button onClick={() => router.refresh()}>Reload page</Button>
      </main>
    )
  }

  if (authorized !== true) {
    return (
      <main className="flex h-screen items-center justify-center bg-background">
        <span className="animate-pulse text-xl font-bold">...</span>
      </main>
    )
  }

  return <>{children}</>
}
