import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  decimal,
  float,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { captainOrderDetails } from "./captain-order-details";
import { rooms } from "./rooms";
import { sales } from "./sales";
import { tables } from "./tables";
import { users } from "./users";

export const captainOrders = mysqlTable("captain_orders", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  table_id: bigint("table_id", { mode: "bigint", unsigned: true }).references(
    () => tables.id,
    { onDelete: "restrict" },
  ),
  room_id: bigint("room_id", { mode: "bigint", unsigned: true }).references(
    () => rooms.id,
    { onDelete: "restrict" },
  ),
  customer_name: varchar("customer_name", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  order_number: varchar("order_number", { length: 255 }).notNull(),
  outlet: varchar("outlet", { length: 255 }).notNull(),
  meal_time: varchar("meal_time", { length: 255 }).notNull(),
  compliment: varchar("compliment", { length: 255 }).notNull(),
  order_type: varchar("order_type", { length: 255 }).notNull(),
  created_by: bigint("created_by", {
    mode: "bigint",
    unsigned: true,
  })
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  customer_adult_count: int("customer_adult_count", {
    unsigned: true,
  }).notNull(),
  customer_child_count: int("customer_child_count", {
    unsigned: true,
  }).notNull(),
  discount_amount: decimal("discount_amount", {
    precision: 24,
    scale: 8,
  }).notNull(),
  discount_percent: float("discount_percent").notNull(),
  tax_amount: decimal("tax_amount", { precision: 24, scale: 8 }).notNull(),
  tax_percent: float("tax_percent").notNull(),
  total_gross: decimal("total_gross", {
    precision: 24,
    scale: 8,
  }).notNull(),
  total_net: decimal("total_net", {
    precision: 24,
    scale: 8,
  }).notNull(),
  grand_total: decimal("grand_total", {
    precision: 24,
    scale: 8,
  }).notNull(),
  is_closed: boolean("is_closed").default(false).notNull(),
  bill_print_count: int("bill_print_count", { unsigned: true })
    .notNull()
    .default(0),
  table_check_print_count: int("table_check_print_count", { unsigned: true })
    .notNull()
    .default(0),
  kitchen_print_count: int("kitchen_print_count", { unsigned: true })
    .notNull()
    .default(0),
  unit_business: varchar("unit_business", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const captainOrderRelations = relations(
  captainOrders,
  ({ one, many }) => ({
    table: one(tables, {
      fields: [captainOrders.table_id],
      references: [tables.id],
    }),
    room: one(rooms, {
      fields: [captainOrders.room_id],
      references: [rooms.id],
    }),
    userCreator: one(users, {
      fields: [captainOrders.created_by],
      references: [users.id],
    }),
    captainOrderDetails: many(captainOrderDetails),
    sales: many(sales),
  }),
);
