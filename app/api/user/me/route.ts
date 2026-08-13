import { adminAuth, adminDb } from "@/utils/firebase-admin"
import type { UserDocResponse } from "@/types/user"
import { NextRequest, NextResponse } from "next/server"
import { FirebaseAppError } from "firebase-admin"

const SESSION_COOKIE_NAME = "__session"

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let uid: string
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    uid = decoded.uid
  } catch (err) {
    console.error("Invalid session cookie in /api/user/me", err)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const docSnap = await adminDb.collection("users").doc(uid).get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "User document not found" },
        { status: 404 }
      )
    }

    const data = docSnap.data()!
    // console.log("READING USER DOC", uid, Date.now())

    const response: UserDocResponse = {
      uid: docSnap.id,
      name: data.name ?? null,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      provider_id: data.provider_id,
      plan: data.plan,
      account_type: data.account_type ?? "user",
      onboarding_completed: data.onboarding_completed ?? false,
      createdAt:
        data.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
    }

    return NextResponse.json(response)
  } catch (err) {
    if (err instanceof FirebaseAppError)
      console.error("Failed to fetch user doc", err.message)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
