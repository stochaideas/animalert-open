import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const hostname = req.headers.get("host") ?? "";

  if (
    hostname === "stage.eco-alert.org" &&
    req.nextUrl.pathname === "/"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/eco-alert";
    return NextResponse.rewrite(url);
  }

  if (isProtectedRoute(req)) {
    const { sessionClaims } = await auth();

    const isAdmin = sessionClaims?.role === "admin";
    if (!isAdmin) {
      const url = new URL("/forbidden", req.url);
      return new Response(null, {
        status: 302, // or 307
        headers: { Location: url.toString() },
      });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
