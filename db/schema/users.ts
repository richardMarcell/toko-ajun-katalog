import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { bookletUsedPromos } from "./booklet-used-promos";
import { captainOrders } from "./captain-orders";
import { ipLocations } from "./ip-locations";
import { lockerWallet } from "./locker-wallet";
import { sales } from "./sales";
import { salesSwimmingClass } from "./sales-swimming-class";
import { salesTemporary } from "./sales-temporary";
import { sessions } from "./sessions";
import { supportTickets } from "./support-tickets";
import { swimmingClassCustomerHistories } from "./swimming-class-customer-histories";
import { userHasRoles } from "./user-has-roles";
import { walletHistories } from "./wallet-histories";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  salesTemporary: one(salesTemporary),
  userHasRoles: many(userHasRoles),
  swimmingClassCustomerHistories: many(swimmingClassCustomerHistories),
  salesSwimmingClass: many(salesSwimmingClass),
  sales: many(sales),
  walletHistories: many(walletHistories),
  bookletUsedPromos: many(bookletUsedPromos),
  lockerWallet: many(lockerWallet),
  captainOrders: many(captainOrders),
  sessions: many(sessions),
  ipLocations: many(ipLocations),
  reportedTickets: many(supportTickets, {
    relationName: "user",
  }),
  resolvedTickets: many(supportTickets, {
    relationName: "resolver",
  }),
}));
