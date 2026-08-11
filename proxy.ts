import { adminAuth } from "./utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "__session";

export const config = {
    runtime: "nodejs",
    matcher: [
       "/dashboard/:path*",
       "/billing",
        
    ],
};

export async function proxy(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
        return redirectTo("/login", currentPath, req);
    }

    try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

        if (!decoded.email_verified) {
            return redirectTo("/verify-email", currentPath, req);
        }

        return NextResponse.next();
    } catch (err) {
        // Expired, revoked, or malformed cookie — treat as logged out.
        console.error("Session cookie verification failed", err);
        const response = redirectTo("/login", currentPath, req);
        response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
        return response;
    }
}

function redirectTo(destination: string, redirectFrom: string, req: NextRequest) {
    const url = req.nextUrl.clone();
    url.pathname = destination;
    url.searchParams.set("redirect", redirectFrom);
    return NextResponse.redirect(url);
}