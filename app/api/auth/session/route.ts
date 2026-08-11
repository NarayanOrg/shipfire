import { adminAuth } from "@/utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken || typeof idToken !== "string") {
            return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
        }

        // Verify the token is real and not expired before minting a cookie
        // from it — createSessionCookie alone doesn't re-validate freshness.
        await adminAuth.verifyIdToken(idToken);

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRES_IN_MS,
        });

        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_EXPIRES_IN_MS / 1000,
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Failed to create session cookie", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return response;
}