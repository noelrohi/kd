import { env } from "@/env.mjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export { projectTable as tableCreator } from "./schema/_table";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
