import { bigint, mysqlTable } from "drizzle-orm/mysql-core";
import { wallets } from "./wallets";
import { sales } from "./sales";
import { relations } from "drizzle-orm";

export const walletTicketSale = mysqlTable("wallet_ticket_sale", {
  wallet_id: bigint("wallet_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => wallets.id, { onDelete: "restrict" }),
  ticket_sale_id: bigint("ticket_sale_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => sales.id, { onDelete: "restrict" }),
});

export const walletTicketSaleRelations = relations(
  walletTicketSale,
  ({ one }) => ({
    wallet: one(wallets, {
      fields: [walletTicketSale.wallet_id],
      references: [wallets.id],
    }),
    ticketSale: one(sales, {
      fields: [walletTicketSale.ticket_sale_id],
      references: [sales.id],
    }),
  }),
);
