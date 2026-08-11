'use client'
import Header from "@/components/layouts/Header";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useUserDoc } from "@/hooks/useUserDoc";

export default function Page() {
  const { data: u } = useUserAuth()
  const { data } = useUserDoc()
  return (
    <main className="min-h-screen">
      <Header />
      {u?.email}
      {data?.account_type}
      <h1>Hello</h1>
    </main>
  )
}
