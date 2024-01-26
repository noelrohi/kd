"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../actions";
import { PasswordInput } from "./password-input";

export function UserAuthForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="grid gap-4">
      <Input placeholder={"example@gmail.com"} name="email" />
      <PasswordInput name="password" />
      <LoginButton />
      {state === "CredentialsSignin" && (
        <p className="text-destructive">Invalid Credentials</p>
      )}
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Logging In" : "Submit"}
    </Button>
  );
}
