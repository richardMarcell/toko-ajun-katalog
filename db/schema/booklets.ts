import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { bookletPromo } from "./booklet-promo";
import { bookletUsedPromos } from "./booklet-used-promos";

export const booklets = mysqlTable("booklets", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  code_start: varchar("code_start", { length: 255 }).notNull(),
  code_end: varchar("code_end", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true),
  periode_start: date("periode_start").notNull(),
  periode_end: date("periode_end").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const bookletsRelations = relations(booklets, ({ many }) => ({
  bookletPromos: many(bookletPromo),
  bookletUsedPromos: many(bookletUsedPromos),
}));
