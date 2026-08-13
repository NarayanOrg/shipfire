"use client";
import LogOutBtn from "@/components/LogOutBtn";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentAuthUser } from "@/hooks/useUserAuth";
import { useUserDoc } from "@/hooks/useUserDoc";
import { useAuth } from "@/stores/authAuthStore";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function UserCard() {
    const { data: user, isLoading, isError, error } = useUserDoc();
    const { data: emailVerified } = useCurrentAuthUser();
    const { logout } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                Couldn&apos;t load user data{error instanceof Error ? `: ${error.message}` : ""}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                No user data found.
            </div>
        );
    }

    const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 w-full max-w-sm">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={user.avatar || ""} alt={user.name?.[0]}/>
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col line-clamp-1">
                    <span className="font-medium text-foreground">
                        {user.name ?? "Unnamed user"}
                    </span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>

                <div className="flex items-center gap-1">
                    <ModeToggle />
                    <Button onClick={logout} size={'icon'}><LogOut /></Button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Badge variant={emailVerified?.emailVerified ? "default" : "outline"}>
                    {emailVerified?.emailVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant="secondary">{user.account_type}</Badge>
                <Badge variant={user.onboarding_completed ? "secondary" : "outline"}>
                    {user.onboarding_completed ? "Onboarded" : "Onboarding pending"}
                </Badge>
                <Badge className="uppercase">
                    {user.plan} PLAN
                </Badge>
            </div>
            <div className="flex">
                {
                    user.plan === "free" &&
                    <Link href={'/'}>
                        <Button>Upgrade to pro</Button>
                    </Link>
                }
            </div>


            <div className="text-xs text-muted-foreground">Joined {joined}</div>
        </div>
    );
}