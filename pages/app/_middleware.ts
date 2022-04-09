import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import supabase from "../../lib/supabase";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = `/login`;
    url.searchParams.append("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
