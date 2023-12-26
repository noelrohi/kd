import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/watch")) {
    const geoloc = geolocation(request);
    console.log({ geoloc });
  }
  const response = NextResponse.next();
  return response;
}
