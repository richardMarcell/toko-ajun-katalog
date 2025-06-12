import { relations } from "drizzle-orm";
import {
  bigint,
  int,
  longtext,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sales } from "./sales";
import { users } from "./users";

export const saleRatings = mysqlTable("sale_ratings", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  user_id: bigint("user_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" })
    .unique(),
  rating: int("rating", { unsigned: true }).notNull(),
  comment: longtext("comment"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const saleRatingRelations = relations(saleRatings, ({ one }) => ({
  user: one(users, {
    fields: [saleRatings.user_id],
    references: [users.id],
  }),
  sale: one(sales, {
    fields: [saleRatings.sales_id],
    references: [sales.id],
  }),
}));
