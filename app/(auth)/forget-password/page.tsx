"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/stores/authAuthStore";
import { Flame } from "lucide-react";
import Link from "next/link";
import React from "react";
import { z } from "zod";

const forgotPasswordZod = z.object({
    email: z.email("invalid email").min(1, "email is required"),
});

export default function ForgetPassword() {
    const { forgotPassword, error, loading, success } = useAuth();
    const [email, setEmail] = React.useState<string>("");
    const [fieldError, setFieldError] = React.useState<{ message: string }[] | undefined>();

    const handleSubmit = async () => {
        setFieldError(undefined);
        const parsed = forgotPasswordZod.safeParse({ email });
        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? "Invalid email";
            setFieldError([{ message }]);
            return;
        }
        await forgotPassword(parsed.data.email);
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            {success ? (
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex size-8 items-center justify-center rounded-md">
                            <Flame className="size-6" />
                        </div>
                        <h1 className="text-xl font-bold">Check your email</h1>
                        <p className="text-sm text-muted-foreground">
                            If an account exists for <span className="font-medium text-foreground">{email}</span>,
                            we&apos;ve sent a link to reset your password.
                        </p>
                        <Link href="/login" className="text-sm underline underline-offset-4">
                            Back to login
                        </Link>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit();
                    }}
                    className="w-full max-w-sm"
                >
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                                <div className="flex size-8 items-center justify-center rounded-md">
                                    <Flame className="size-6" />
                                </div>
                                <span className="sr-only">ShipFire</span>
                            </Link>
                            <h1 className="text-xl font-bold">Reset Password</h1>
                            <FieldDescription>
                                Remembered it? <Link href="/login">Log in</Link>
                            </FieldDescription>
                        </div>
                        <div className="flex items-center justify-center">
                            {error && (
                                <span className="text-sm font-medium text-rose-500">{error}</span>
                            )}
                        </div>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                                autoComplete="email"
                            />
                            <FieldError errors={fieldError} />
                        </Field>
                        <Field>
                            <Button disabled={loading} type="submit">
                                {loading ? <Spinner /> : "Send reset email"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            )}
        </div>
    );
}