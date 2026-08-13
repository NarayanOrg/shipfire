"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useUserAuth } from "@/hooks/useUserAuth";

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: user, isPending } = useUserAuth();

    useEffect(() => {
        if (isPending) return;
        if (user) {
            router.push(user.emailVerified ? "/dashboard" : "/verify-email");
        }
    }, [user, isPending, router]);

    if (isPending) {
        return (
            <main className="flex min-h-svh items-center justify-center bg-background">
                <Spinner />
            </main>
        );
    }

    if (user) return null; // mid-redirect, render nothing

    return <>{children}</>;
}