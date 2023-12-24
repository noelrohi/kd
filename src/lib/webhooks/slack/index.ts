import { env } from "@/env.mjs";

export async function notify(text: string) {
  if (env.SLACK_WEBHOOK_URL && process.env.NODE_ENV === "production") {
    const res = await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });
    // console.log(await res.text());
  }
}
