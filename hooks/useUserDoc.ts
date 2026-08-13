import type { UserDocResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "./useUserAuth";

export const userDocQueryKey = ["user", "doc"] as const;

async function fetchUserDoc(): Promise<UserDocResponse> {
    const res = await fetch("/api/user/me");

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to fetch user (${res.status})`);
    }

    return res.json();
}

export function useUserDoc() {
    const { isAuthenticated, isLoading: isAuthLoading } = useUserAuth();

    return useQuery<UserDocResponse>({
        queryKey: userDocQueryKey,
        queryFn: fetchUserDoc,
        // Wait until auth state is resolved AND confirmed signed-in before
        // firing — avoids a guaranteed 401 on every logged-out page load.
        enabled: !isAuthLoading && isAuthenticated,
        retry: (failureCount, error) => {
            // Don't retry auth failures, only transient/server errors
            if (error.message.includes("Not authenticated")) return false;
            return failureCount < 2;
        },
    });
}