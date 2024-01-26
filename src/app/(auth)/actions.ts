"use server";

import { signIn, signOut } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
    revalidateTag("auth");
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialsSignin";
    }
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut();
  } catch (error) {
    if ((error as Error).message.includes("SignOut")) {
      return "SignOut";
    }
    throw error;
  }
}
