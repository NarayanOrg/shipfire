"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { GitHubIcon, GoogleIcon } from "./Icons"
import { useAuth } from "@/stores/authAuthStore"
import { Spinner } from "@/components/ui/spinner"
import { useSearchParams } from "next/navigation"

export function OAuth() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const { signInWithOAuth, loading, error } = useAuth()
  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex items-center justify-center">
        {error && (
          <span className="text-sm font-medium text-rose-500">
            {error == "Firebase: Error (auth/operation-not-allowed)."
              ? "Auth type not allowed"
              : error == "Firebase: Error (auth/internal-error)."
                ? "Connect to the internet"
                : "Error signing in - try again"}
          </span>
        )}
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to ShipFire</CardTitle>
          <CardDescription>
            Sign in with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <FieldGroup>
              <Field>
                <Button
                  onClick={() => signInWithOAuth("google", redirect)}
                  variant="outline"
                  type="button"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <GoogleIcon />
                      Sign in with Google
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => signInWithOAuth("github", redirect)}
                  type="button"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <GitHubIcon />
                      Sign in with GitHub
                    </>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
