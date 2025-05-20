import { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";
import authMiddleware from "./lib/services/middleware/auth-middleware";
import checkClientSession from "./lib/services/middleware/check-client-session";

// NOTE: Middleware using edge runtime, it does not support Node.js 'stream' module.
// In middleware can't run database function
// SOLUTION: possible to change the middleware runtime to node runtime

export default async function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  /* --- Skip JWT check for the login page --- */
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/auth/login")) return NextResponse.next();
  if (pathname == "/") return NextResponse.next();

  /* --- Check client session available on database --- */
  const { isUserSessionValid } = await checkClientSession({ req });
  if (!isUserSessionValid)
    return NextResponse.redirect(new URL("/auth/login", req.url));

  return authMiddleware(req, event);
}

export const config = {
  matcher: [
    // Exclude /api, /_next, static files, and /forbidden
    "/((?!api|_next|forbidden|.*\\..*).*)",
  ],
};
