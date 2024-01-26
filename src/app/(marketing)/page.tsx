import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="bg-gradient-to-r from-foreground to-gray-500 bg-clip-text font-bold font-heading text-3xl text-transparent tracking-tighter sm:text-5xl xl:text-6xl/none">
                Immerse Yourself in K-Drama Magic
              </h1>
              <p className="mx-auto max-w-3xl text-zinc-500 dark:text-zinc-100 md:text-xl">
                Experience the enchanting world of Korean drama like never
                before with our cutting-edge app designed for true K-Drama
                aficionados.
              </p>
              <div className="flex justify-center gap-2">
                <Link href={"/home"} className={buttonVariants()}>
                  Start K-Watching
                </Link>
                <Link
                  href={"/signin"}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
