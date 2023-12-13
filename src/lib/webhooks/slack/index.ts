import { env } from "@/env.mjs";

export async function notifyWatching(text: string) {
  if (env.SLACK_WEBHOOK_URL) {
    const res = await fetch(env.SLACK_WEBHOOK_URL, {
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });
    console.log(await res.text());
  }
}
