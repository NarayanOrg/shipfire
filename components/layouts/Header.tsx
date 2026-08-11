"use client"
import { Flame, Layout } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useUserAuth } from "@/hooks/useUserAuth"
import { Spinner } from "../ui/spinner"
import UserDropdown from "../UserDropdown";

export default function Header() {
  const { data: u, isLoading: authLoading } = useUserAuth()
  return (
    <header>
      <div className="flex items-center justify-between border-b py-2">
        <Link href={"/"} className="flex items-center gap-1 text-lg">
          <Flame size={30} />
          <span>
            Ship<span className="text-orange-500">Fire</span>
          </span>
        </Link>

        <nav className="flex items-center justify-center gap-5">
          <Link
            href={"https://github.com/NarayanOrg/shipfire"}
            target="_blank"
            className="text-muted-foreground"
          >
            <Button variant={"ghost"}>Read Docs</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {authLoading ? (
            <Spinner />
          ) : u ? (
            <>
              <Link href={"/dashboard"}>
                <Button size={"lg"}>
                  Dashboard
                  <Layout />
                </Button>
              </Link>
              <UserDropdown />
            </>
          ) : (
            <>
              <Link href={"/login"}>
                <Button variant={"outline"}>Login</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
