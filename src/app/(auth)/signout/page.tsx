import { env } from "@/env.mjs";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButtons from "./buttons";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign out",
  description: "Sign out of your account",
};

export default async function SignOutPage() {
  const session = await auth();
  if (!session) redirect("/signin");
  return (
    <section className="container grid max-w-xs items-center gap-8 pt-6 pb-8 md:py-8">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl md:text-3xl">Sign out</h1>
        <p className="text-sm sm:text-base">
          Are you sure you want to sign out?
        </p>
        <SignOutButtons />
      </div>
    </section>
  );
}
