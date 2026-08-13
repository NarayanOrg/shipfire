// import { adminAuth } from "./utils/firebase-admin"
import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "__session"

export const config = {
  matcher: ["/dashboard/:path*", "/billing"],
}

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return redirectTo("/sign-in", currentPath, req)
  }
}

function redirectTo(
  destination: string,
  redirectFrom: string,
  req: NextRequest
) {
  const url = req.nextUrl.clone()
  url.pathname = destination
  url.searchParams.set("redirect", redirectFrom)

  return NextResponse.redirect(url)
}
