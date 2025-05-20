import {
  bigint,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const activityLogs = mysqlTable("activity_logs", {
  ip_address: varchar("ip_address", { length: 255 }).notNull(),
  user_id: bigint("user_id", { mode: "bigint", unsigned: true }).references(
    () => users.id,
    { onDelete: "restrict" },
  ),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  payloads: json("payloads"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const activityLogRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.user_id],
    references: [users.id],
  }),
}));
