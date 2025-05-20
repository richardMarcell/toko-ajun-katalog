import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { ipLocations } from "./ip-locations";

export const supportTickets = mysqlTable("support_tickets", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  ip_address: varchar("ip_address", { length: 255 })
    .notNull()
    .references(() => ipLocations.ip_address, { onDelete: "restrict" }),
  user_id: bigint("user_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  mark_as_done_by: bigint("mark_as_done_by", {
    mode: "bigint",
    unsigned: true,
  }).references(() => users.id, { onDelete: "restrict" }),
  is_done: boolean("is_done").default(false).notNull(),
  mark_as_done_at: timestamp("mark_as_done_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.user_id],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [supportTickets.mark_as_done_by],
    references: [users.id],
  }),
  ipLocation: one(ipLocations, {
    fields: [supportTickets.ip_address],
    references: [ipLocations.ip_address],
  }),
}));
