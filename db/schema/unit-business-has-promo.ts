import {
  bigint,
  mysqlTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { promos } from "./promos";

export const unitBusinessHasPromo = mysqlTable(
  "unit_business_has_promo",
  {
    unit_business: varchar("nama", { length: 255 }).notNull(),
    promo_id: bigint("promo_id", { mode: "bigint", unsigned: true })
      .notNull()
      .references(() => promos.id, { onDelete: "restrict" }),
  },
  (table) => ({
    pk: uniqueIndex("ux_unit_business_promo").on(
      table.unit_business,
      table.promo_id,
    ),
  }),
);

export const unitBusinessHasPromoRelations = relations(
  unitBusinessHasPromo,
  ({ one }) => ({
    promo: one(promos, {
      fields: [unitBusinessHasPromo.promo_id],
      references: [promos.id],
    }),
  }),
);
