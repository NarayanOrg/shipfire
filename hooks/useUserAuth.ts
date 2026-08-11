import { auth } from "@/utils/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect } from "react";

export const authQueryKey = ["auth", "currentUser"] as const;

export function useCurrentAuthUser() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            queryClient.setQueryData<User | null>(authQueryKey, user);
        });

        return () => unsubscribe();
    }, [queryClient]);

    return useQuery<User | null>({
        queryKey: authQueryKey,
        // Never actually called under normal operation — the listener above
        // is what populates the cache. This only fires if something reads
        // the query before the listener has fired once, and just parks the
        // query in a pending state until it does (staleTime: Infinity below
        // prevents this from being treated as "stale" and refetched).
        queryFn: () => new Promise<User | null>(() => {}),
        staleTime: Infinity,
        gcTime: Infinity,
        // Firebase's own listener is the source of truth — don't let React
        // Query's window-refocus/reconnect refetching second-guess it.
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

/**
 * Convenience wrapper for the common case of "do I have a signed-in,
 * verified user right now" — returns loading state alongside the user.
 */
export function useUserAuth() {
    const results = useCurrentAuthUser();

    return {
       ...results,
       isAuthenticated: !!results.data
    };
}