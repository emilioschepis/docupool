import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import supabase from "../../lib/supabase";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);

  if (!user || !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/login`;
    url.searchParams.append("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const payloadBuffer = Buffer.from(token.split(".")[1], "base64");
  const payload = JSON.parse(payloadBuffer.toString());

  if (!payload.exp || payload.exp * 1000 < new Date().getTime()) {
    const url = req.nextUrl.clone();
    url.pathname = `/login`;
    url.searchParams.append("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
