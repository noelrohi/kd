import { env } from "@/env.mjs";
import type { Metadata } from "next";

import SignOutButtons from "./buttons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign out",
  description: "Sign out of your account",
};

export default async function SignOutPage() {
  const session = await auth();
  if (!session) redirect("/signin");
  return (
    <section className="grid container items-center gap-8 pb-8 pt-6 md:py-8 max-w-xs">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-3xl">Sign out</h1>
        <p className="text-sm sm:text-base">
          Are you sure you want to sign out?
        </p>
        <SignOutButtons />
      </div>
    </section>
  );
}
