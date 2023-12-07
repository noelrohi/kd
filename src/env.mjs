import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().endsWith('ssl={"rejectUnauthorized":true}'),
    NEXTAUTH_SECRET: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  },
});
