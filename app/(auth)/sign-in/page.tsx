import { Suspense } from "react"
import { OAuth } from "../_components/OAuth"
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated"

export default function SignIn() {
  return (
    <Suspense fallback={<div>...</div>}>
      <RedirectIfAuthenticated>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
          <div className="w-full max-w-sm">
            <OAuth />
          </div>
        </div>
      </RedirectIfAuthenticated>
    </Suspense>
  )
}
