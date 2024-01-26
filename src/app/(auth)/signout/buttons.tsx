"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { logOut } from "../actions";

export default function SignOutButtons() {
  const router = useRouter();
  const [state, dispatch] = useFormState(logOut, undefined);
  return (
    <>
      <div className="flex justify-center gap-2">
        <form action={dispatch}>
          <SignOut />
        </form>
        <Button variant={"outline"} onClick={() => router.back()}>
          Go back
        </Button>
      </div>
      {state === "SignOut" && (
        <p className="text-destructive">Failed to sign out</p>
      )}
    </>
  );
}

function SignOut() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Sign{pending && "ing"} Out</Button>;
}
