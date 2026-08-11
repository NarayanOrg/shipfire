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

const signUpZod = z.object({
  name: z
    .string("name is required")
    .min(1, "name is required")
    .max(255, "find a shorter name"),
  email: z.email("email is required").min(1, "email is required"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(200, "password must not exceed 200")
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/[a-z]/, "Needs a lowercase letter")
    .regex(/[0-9]/, "Needs a number")
    .regex(/[^A-Za-z0-9]/, "Needs a special character"),
})

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const [fieldErrors, setFieldErrors] = useState<{
    name?: { message: string }[]
    email?: { message: string }[]
    password?: { message: string }[]
  }>({})
  const [name, setname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const {
    loading,
    signUp,
    signInWithOAuth,
    error: authError,
  } = useAuth()

  const handleLogin = async () => {
    setFieldErrors({})
    const payload = { name, email, password }
    const parsed = signUpZod.safeParse(payload)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setFieldErrors({
        name: flat.name?.map((message) => ({ message })),
        email: flat.email?.map((message) => ({ message })),
        password: flat.password?.map((message) => ({ message })),
      })
      return
    }
    await signUp(parsed.data, redirect)
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
            <h1 className="text-xl font-bold">Create a ShipFire Account.</h1>
            <FieldDescription>
              Already have an account? <Link href="/login">Sign up</Link>
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
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              onChange={(e) => setname(e.target.value)}
              placeholder="John Doe"
              required
              aria-autocomplete="both"
            />
            <FieldError errors={fieldErrors.name} />
          </Field>
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
            <FieldError errors={fieldErrors.email} />
          </Field>
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
              {loading ? <Spinner /> : "Create account"}
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
