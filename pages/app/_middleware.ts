import { withMiddlewareAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect("/home", 301);
  }

  return withMiddlewareAuthRequired({ redirectTo: "/login" })(req, ev);
}
