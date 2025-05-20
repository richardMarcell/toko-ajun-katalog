import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { sessions } from "./sessions";
import { userHasRoles } from "./user-has-roles";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  userHasRoles: many(userHasRoles),
  sales: many(sales),
  sessions: many(sessions),
}));
