import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Immerse Yourself in K-Drama Magic
              </h1>
              <p className="max-w-3xl text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                Experience the enchanting world of Korean drama like never
                before with our cutting-edge app designed for true K-Drama
                aficionados.
              </p>
              <div className="flex gap-2 justify-center">
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
