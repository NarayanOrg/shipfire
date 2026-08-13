"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmailVerifiedCard() {
    const router = useRouter();
    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-sm")}>
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-8 items-center justify-center rounded-md">
                    <Flame className="size-6" />
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <CircleCheck className="size-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold">Email verified</h1>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Your email has been verified. You&apos;re all set.
                </p>
            </div>

            <Button onClick={() => router.push("/dashboard")}>Continue</Button>
        </div>
    );
}