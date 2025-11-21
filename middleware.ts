import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { TOKEN_STORAGE_KEY } from "@/lib/constants"

const PROTECTED_ROUTES = ["/dashboard"]
const PUBLIC_DASHBOARD_SEGMENTS = ["/dashboard/preview"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_STORAGE_KEY)?.value
  const { pathname } = request.nextUrl

  if (PUBLIC_DASHBOARD_SEGMENTS.some((openRoute) => pathname.startsWith(openRoute))) {
    return NextResponse.next()
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirectedFrom", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}

