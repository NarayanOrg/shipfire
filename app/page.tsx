'use client'
import { Button } from "@/components/ui/button"
import { useUserAuth } from "@/hooks/useUserAuth";
import { useUserDoc } from "@/hooks/useUserDoc";

export default function Page() {
  const { data: u } = useUserAuth()
  const { data } = useUserDoc()
  return (
    <div className="flex min-h-svh p-6">
      {u?.email}
      {data?.account_type}
    </div>
  )
}
