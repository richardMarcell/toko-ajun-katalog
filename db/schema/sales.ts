import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { salesDetails } from "./sales-details";
import { users } from "./users";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { saleRatings } from "./sale-ratings";

export const sales = mysqlTable("sales", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 255 })
    .notNull()
    .default(SalesStatusEnum.OPEN),
  grand_total: decimal("grand_total", {
    precision: 24,
    scale: 8,
  }).notNull(),
  created_by: bigint("created_by", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const salesRelations = relations(sales, ({ many, one }) => ({
  salesDetails: many(salesDetails),
  user: one(users, {
    fields: [sales.created_by],
    references: [users.id],
  }),
  saleRating: one(saleRatings),
}));
