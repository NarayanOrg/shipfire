"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useUserAuth } from "@/hooks/useUserAuth";
import { VerifyEmailCard } from "./VerifyEmailCard";
import { EmailVerifiedCard } from "./EmailVerifiedCard";

export default function VerifyEmailClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect");

    const { data: user, isPending } = useUserAuth();

    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.push("/login");
            return;
        }

        if (user.emailVerified) {
            router.push(redirect || "/dashboard");
        }
    }, [user, isPending, router, redirect]);

    if (isPending) {
        return (
            <section className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
                <Spinner />
            </section>
        );
    }

    return (
        <section className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            {!user?.emailVerified ? (
                <VerifyEmailCard />
            ) : (
                <EmailVerifiedCard />
            )}
        </section>
    );
}