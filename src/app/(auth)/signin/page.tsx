import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, signIn } from "@/lib/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const isSignedIn = await auth();
  if (isSignedIn) redirect("/home");
  return (
    <section className="container max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to K-Next</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form>
            <Button
              variant={"outline"}
              formAction={async () => {
                "use server";
                await signIn("discord");
              }}
            >
              <Icons.discord className="h-5 w-5 mr-2" />
              Discord
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
