import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { booklets } from "./booklets";
import { promos } from "./promos";
import { sales } from "./sales";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const bookletUsedPromos = mysqlTable("booklet_used_promos", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  booklet_id: bigint("booklet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => booklets.id, { onDelete: "restrict" }),
  booklet_code: varchar("booklet_code", { length: 255 }).notNull(),
  promo_id: bigint("promo_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => promos.id, { onDelete: "restrict" }),
  sales_id: bigint("sales_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const bookletUsedPromosRelations = relations(
  bookletUsedPromos,
  ({ one }) => ({
    userCreator: one(users, {
      fields: [bookletUsedPromos.created_by],
      references: [users.id],
    }),
    booklet: one(booklets, {
      fields: [bookletUsedPromos.booklet_id],
      references: [booklets.id],
    }),
    promo: one(promos, {
      fields: [bookletUsedPromos.promo_id],
      references: [promos.id],
    }),
    sale: one(sales, {
      fields: [bookletUsedPromos.sales_id],
      references: [sales.id],
    }),
  }),
);
