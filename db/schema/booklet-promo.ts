import { bigint, int, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { booklets } from "./booklets";
import { promos } from "./promos";
import { relations } from "drizzle-orm";

export const bookletPromo = mysqlTable("booklet_promo", {
  booklet_id: bigint("booklet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => booklets.id, { onDelete: "restrict" }),
  promo_id: bigint("promo_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => promos.id, { onDelete: "restrict" }),
  qty: int("qty", { unsigned: true }).notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const bookletPromoRelations = relations(bookletPromo, ({ one }) => ({
  booklet: one(booklets, {
    fields: [bookletPromo.booklet_id],
    references: [booklets.id],
  }),
  promo: one(promos, {
    fields: [bookletPromo.promo_id],
    references: [promos.id],
  }),
}));
