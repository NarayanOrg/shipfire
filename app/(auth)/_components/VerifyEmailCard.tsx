"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { auth } from "@/utils/firebase";
import { FirebaseError } from "firebase/app";
import { sendEmailVerification } from "firebase/auth";
import { Flame, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserAuth } from "@/hooks/useUserAuth";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailCard({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const { data: refreshedUser } = useUserAuth()
    const [sending, setSending] = useState(false);
    const [checking, setChecking] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const email = auth.currentUser?.email ?? null;

    useEffect(() => {
        if (cooldown === 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error("You need to be signed in to resend a verification email");
            router.push("/login");
            return;
        }

        setSending(true);
        try {
            await sendEmailVerification(user);
            toast.success("Verification email sent");
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            if (err instanceof FirebaseError && err.code === "auth/too-many-requests") {
                toast.error("Too many attempts — please wait a bit before trying again");
            } else if (err instanceof FirebaseError) {
                toast.error(err.message || "Failed to resend email");
            } else {
                toast.error("Something went wrong sending the email");
            }
        } finally {
            setSending(false);
        }
    };
    
    const handleCheckVerification = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/login");
            return;
        }

        setChecking(true);
        try {
            await user.reload();

            if (refreshedUser?.emailVerified) {
                // The session cookie middleware reads was minted BEFORE
                // verification, so it still has email_verified: false baked
                // into its claims. Reissue it now that Firebase Auth's real
                // record is verified, or middleware will keep bouncing this
                // user back here even though they're actually verified.
                const idToken = await refreshedUser.getIdToken(true);
                const res = await fetch("/api/auth/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                if (!res.ok) {
                    toast.error("Verified, but couldn't refresh your session — try reloading the page");
                    return;
                }

                toast.success("Email verified 🎉");
            } else {
                toast.info("Still not verified — check your inbox and click the link");
            }
        } catch (err) {
            toast.error("Couldn't check verification status, try again");
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-8 items-center justify-center rounded-md">
                    <Flame className="size-6" />
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <MailCheck className="size-6 text-muted-foreground" />
                </div>
                <h1 className="text-xl font-bold">Verify your email</h1>
                <p className="max-w-sm text-sm text-muted-foreground">
                    {email ? (
                        <>
                            We sent a verification link to{" "}
                            <span className="font-medium text-foreground">{email}</span>.
                            Click the link to activate your account.
                        </>
                    ) : (
                        "We sent a verification link to your email. Click the link to activate your account."
                    )}
                </p>
            </div>

            <div className="rounded-md border border-border bg-muted/50 p-3 text-center text-sm text-muted-foreground">
                Don&apos;t see the email? Check your spam or junk folder —
                verification emails sometimes land there.
            </div>

            <Button onClick={handleCheckVerification} disabled={checking}>
                {checking ? <Spinner /> : "I have verified my email"}
            </Button>

            <Button onClick={handleResend} disabled={sending || cooldown > 0} variant="outline">
                {sending ? (
                    <Spinner />
                ) : cooldown > 0 ? (
                    `Resend available in ${cooldown}s`
                ) : (
                    "Resend verification email"
                )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Wrong email?{" "}
                <Button variant="link" type="button" onClick={() => router.push("/sign-up")}>
                    Sign in with a different account
                </Button>
            </p>
        </div>
    );
}