import { withMiddlewareAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  return withMiddlewareAuthRequired({ redirectTo: "/login" })(req, ev);
}
