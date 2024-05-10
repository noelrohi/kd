import { env } from "@/env.mjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as auth from "./schema/auth";
import * as main from "./schema/main";
import * as relations from "./schema/relations";

export const schema = { ...auth, ...main, ...relations };

export { projectTable as tableCreator } from "./schema/_table";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
