import { env } from "@/env";
import {
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${env.PROJECT_NAME}_${name}`);

export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

export const userTable = createTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  // emailVerified: timestamp("email_verified", { mode: "date" }),
  accountType: accountTypeEnum("account_type").notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const sessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
