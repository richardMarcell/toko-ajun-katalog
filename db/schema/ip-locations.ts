import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { supportTickets } from "./support-tickets";
import { permissions } from "./permissions";

export const ipLocations = mysqlTable("ip_locations", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  ip_address: varchar("ip_address", { length: 255 }).notNull().unique(),
  location_desc: varchar("location_desc", { length: 225 }).notNull(),
  current_logged_in_user: bigint("current_logged_in_user", {
    mode: "bigint",
    unsigned: true,
  }).references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const ipLocationRelations = relations(ipLocations, ({ one, many }) => ({
  currentLoggedInUser: one(users, {
    fields: [ipLocations.current_logged_in_user],
    references: [users.id],
  }),
  supportTickets: many(supportTickets),
}));
