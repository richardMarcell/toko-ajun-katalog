import { db } from "@/db";

export async function getCashQTransactionTicketList({
  walletId,
}: {
  walletId: string;
}) {
  const cashqTransactionTicketList = await db.query.walletTicketSale.findFirst({
    with: {
      ticketSale: {
        columns: {
          id: true,
        },
        with: {
          salesDetails: {
            columns: {
              qty: true,
              subtotal: true,
            },
            with: {
              product: {
                columns: {
                  description: true,
                },
              },
            },
          },
        },
      },
    },
    where: (walletTicketSale, { eq }) =>
      eq(walletTicketSale.wallet_id, BigInt(walletId)),
    columns: {
      ticket_sale_id: true,
    },
  });

  return {
    cashqTransactionTicketList: cashqTransactionTicketList,
  };
}
