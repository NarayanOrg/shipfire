"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Flame } from "lucide-react"
import Link from "next/link"
import { GitHubIcon, GoogleIcon } from "./Icons"
import { useAuth } from "@/stores/authAuthStore"
import { z } from "zod"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

const logInZod = z.object({
  email: z.email("invalid email").min(1, "email is required"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(200, "password must not exceed 200"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const [fieldErrors, setFieldErrors] = useState<{
    email?: { message: string }[]
    password?: { message: string }[]
  }>({})
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const {
    loading,
    login,
    signInWithOAuth,
    error: authError,
  } = useAuth()

  const handleLogin = async () => {
    setFieldErrors({})
    const payload = { email, password }
    const parsed = logInZod.safeParse(payload)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: flat.email?.map((message) => ({ message })),
        password: flat.password?.map((message) => ({ message })),
      })
      return
    }
   login(parsed.data, redirect)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleLogin()
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Flame className="size-6" />
              </div>
              <span className="sr-only">ShipFire</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome back to ShipFire.</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </FieldDescription>
          </div>
          <div className="flex items-center justify-center">
            {authError && (
              <span className="text-sm font-medium text-rose-500">
                {authError === "Firebase: Error (auth/invalid-credential)."
                  ? "Invalid email or password"
                  : authError}
              </span>
            )}
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
              aria-autocomplete="both"
            />
          </Field>
          <FieldError errors={fieldErrors.email} />
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              aria-autocomplete="both"
            />
            <FieldError errors={fieldErrors.password} />
          </Field>
          <Field>
            <Button disabled={loading} type="submit">
              {loading ? <Spinner /> : "Login"}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              disabled={loading}
              onClick={() => signInWithOAuth("google")}
              variant="outline"
              type="button"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </Button>
            <Button
              disabled={loading}
              onClick={() => signInWithOAuth("github")}
              type="button"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <GitHubIcon className="rounded-full bg-black" />
                  Continue with GitHub
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
