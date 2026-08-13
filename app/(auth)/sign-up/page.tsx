import { Suspense } from "react";
import { SignUpForm } from "../_components/signup-form";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";


export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectIfAuthenticated>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </RedirectIfAuthenticated>
    </Suspense>
  )
}
