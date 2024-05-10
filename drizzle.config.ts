import { env } from "@/env.mjs";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  dialect: "postgresql",
  migrations: {
    schema: "kd_migrations",
    table: "public",
  },
  out: "./src/db",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["kd_*"],
  verbose: true,
  strict: true,
});
