import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  driver: "mysql2",
  out: "./src/db",
  dbCredentials: {
    uri: process.env.DATABASE_URL || "",
  },
  tablesFilter: ["kd_*"],
  verbose: true,
  strict: true,
});
