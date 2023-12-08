import { createId } from "@paralleldrive/cuid2";
import { mysqlTableCreator, varchar } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mySqlTable = mysqlTableCreator((name) => `kd_${name}`);

export const idCreator = varchar("id", { length: 128 })
  .$defaultFn(() => createId())
  .primaryKey();
