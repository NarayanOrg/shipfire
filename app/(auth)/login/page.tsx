import { Suspense } from "react";
import { LoginForm } from "../_components/login-form";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectIfAuthenticated>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </RedirectIfAuthenticated>
    </Suspense>
  )
}
