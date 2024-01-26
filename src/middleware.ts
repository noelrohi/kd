import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { formatRelative } from "date-fns";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "10s"),
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/watch")) {
    return NextResponse.next();
  }

  const ip = headers().get("x-forwarded-for");
  const { success, limit, remaining, reset } = await ratelimit.limit(
    ip ?? "anonymous",
  );
  if (!success) {
    console.log(`Ratelimited, reset in ${formatRelative(reset, new Date())}`);
    return new NextResponse(
      `Too many Requests. Try again in ${formatRelative(reset, new Date())}`,
      { status: 429 },
    );
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
