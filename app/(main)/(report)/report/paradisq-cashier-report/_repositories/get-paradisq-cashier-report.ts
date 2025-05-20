import { db } from "@/db";
import { payments, sales, salesDetails, walletCashRefunds } from "@/db/schema";
import { ProductConfig } from "@/lib/config/product-config";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { and, eq, gte, inArray, lte, sql, SQLWrapper } from "drizzle-orm";

type ParadisqCashierReport = {
  totalTicketTunai: number;
  totalDepositTunai: number;
  totalTopUpTunai: number;
  totalRefundTunai: number;
  totalSouvenirTunai: number;
  totalYearlyPassTunai: number;
  totalSwimmingClassTunai: number;
  totalTunaiTransaction: number;
  totalTicketNonTunai: number;
  totalDepositNonTunai: number;
  totalTopUpNonTunai: number;
  totalSouvenirNonTunai: number;
  totalYearlyPassNonTunai: number;
  totalSwimmingClassNonTunai: number;
  totalNonTunaiTransaction: number;
  totalTicketVoucher: number;
  totalLockerTransaction: number;
  totalGazeboTransaction: number;
  totalSwimsuitRentTransaction: number;
  totalSouvenirCashQ: number;
  totalCustomersTicketVoided: number;
  totalTransactionTicketVoidedAmount: number;
  totalSouvenirVoided: number;
  totalTransactionSouvenirVoidedAmount: number;
  totalSwimsuitRentVoided: number;
  totalTransactionSwimsuitRentVoidedAmount: number;
  totalLockerVoided: number;
  totalTransactionLockerVoidedAmount: number;
  totalGazeboVoided: number;
  totalTransactionGazeboVoidedAmount: number;
};

// TODO: Optimize query on this page to get ParadisQ cashier report
// TODO: Implement Total Tiket Voucher
export async function getParadisQCashierReport({
  searchParams,
}: {
  searchParams: {
    userId: string;
    startDate: string;
    endDate: string;
  };
}): Promise<ParadisqCashierReport> {
  const transactionfilters: SQLWrapper[] = [];
  const refundTransactionFilters: SQLWrapper[] = [];

  const userId =
    !searchParams.userId || searchParams.userId == "all"
      ? ""
      : searchParams.userId;
  const startDate = searchParams.startDate ? searchParams.startDate : "";
  const endDate = searchParams.endDate ? searchParams.endDate : "";

  if (userId) {
    transactionfilters.push(eq(sales.created_by, BigInt(userId)));
    refundTransactionFilters.push(
      eq(walletCashRefunds.created_by, BigInt(userId)),
    );
  }

  if (startDate && endDate) {
    const start = parseWIBDate(startDate);
    const end = parseWIBDate(endDate);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      transactionfilters.push(
        ...[gte(sales.created_at, start), lte(sales.created_at, end)],
      );
      refundTransactionFilters.push(
        ...[
          gte(walletCashRefunds.created_at, start),
          lte(walletCashRefunds.created_at, end),
        ],
      );
    }
  }

  const totalDepositFromTicketSales = await getTotalDepositFromTicketSales({
    transactionfilters,
  });
  const totalTransactionTicket = await getTotalTransactionFromTicket({
    transactionfilters,
  });
  const totalTransactionWristbandRent = await getTotalTransactionWristbandRent({
    transactionfilters,
  });
  const totalTransactionCashQTransaction =
    await getTotalTransactionCashQTransaction({
      transactionfilters,
    });
  const totalTransactionSouvenir = await getTotalTransactionSouvenir({
    transactionfilters,
  });
  const totalTransactionYearlyPass = await getTotalTransactionYearlyPass({
    transactionfilters,
  });
  const totalTransactionSwimmingClass = await getTotalTransactionSwimmingClass({
    transactionfilters,
  });
  const totalTransactionRefund = await getTotalTransactionRefund({
    refundTransactionFilters,
  });
  const totalTransactionVoided = await getTotalTransactionVoided({
    transactionfilters,
  });

  const totalTicketTunai =
    totalTransactionTicket.totalTunaiTransaction -
    totalDepositFromTicketSales.totalDepositTunai;
  const totalDepositTunai =
    totalDepositFromTicketSales.totalDepositTunai +
    totalTransactionWristbandRent.totalDepositTunai +
    totalTransactionCashQTransaction.totalDepositTunai;
  const totalTopUpTunai =
    totalTransactionWristbandRent.totalTopUpTunai +
    totalTransactionCashQTransaction.totalTopUpTunai;
  const totalRefundTunai = totalTransactionRefund.totalRefund;
  const totalSouvenirTunai = totalTransactionSouvenir.totalTunaiTransaction;
  const totalYearlyPassTunai = totalTransactionYearlyPass.totalTunaiTransaction;
  const totalSwimmingClassTunai =
    totalTransactionSwimmingClass.totalTunaiTransaction;
  const totalTunaiTransaction =
    totalTicketTunai +
    totalDepositTunai +
    totalTopUpTunai +
    totalRefundTunai +
    totalSouvenirTunai +
    totalYearlyPassTunai +
    totalSwimmingClassTunai;

  const totalTicketNonTunai =
    totalTransactionTicket.totalNonTunaiTransaction -
    totalDepositFromTicketSales.totalDepositNonTunai;
  const totalDepositNonTunai =
    totalDepositFromTicketSales.totalDepositNonTunai +
    totalTransactionWristbandRent.totalDepositNonTunai +
    totalTransactionCashQTransaction.totalDepositNonTunai;
  const totalTopUpNonTunai =
    totalTransactionWristbandRent.totalTopUpNonTunai +
    totalTransactionCashQTransaction.totalTopUpNonTunai;
  const totalSouvenirNonTunai =
    totalTransactionSouvenir.totalNonTunaiTransaction;
  const totalYearlyPassNonTunai =
    totalTransactionYearlyPass.totalNonTunaiTransaction;
  const totalSwimmingClassNonTunai =
    totalTransactionSwimmingClass.totalNonTunaiTransaction;
  const totalNonTunaiTransaction =
    totalTicketNonTunai +
    totalDepositNonTunai +
    totalTopUpNonTunai +
    totalSouvenirNonTunai +
    totalYearlyPassNonTunai +
    totalSwimmingClassNonTunai;

  const totalTicketVoucher = 0;
  const totalLockerTransaction =
    totalTransactionCashQTransaction.totalLockerTransaction;
  const totalGazeboTransaction =
    totalTransactionCashQTransaction.totalGazeboTransaction;
  const totalSwimsuitRentTransaction =
    totalTransactionCashQTransaction.totalSwimsuitRentTransaction;
  const totalSouvenirCashQ = totalTransactionSouvenir.totalCashqTransaction;

  const totalCustomersTicketVoided =
    totalTransactionVoided.totalCustomersTicketVoided;
  const totalTransactionTicketVoidedAmount =
    totalTransactionVoided.totalTransactionTicketVoidedAmount -
    totalTransactionVoided.totalTransactionDepositVoidedAmount;
  const totalSouvenirVoided = totalTransactionVoided.totalSouvenirVoided;
  const totalTransactionSouvenirVoidedAmount =
    totalTransactionVoided.totalTransactionSouvenirVoidedAmount;
  const totalSwimsuitRentVoided =
    totalTransactionVoided.totalSwimsuitRentVoided;
  const totalTransactionSwimsuitRentVoidedAmount =
    totalTransactionVoided.totalTransactionSwimsuitRentVoidedAmount;
  const totalLockerVoided = totalTransactionVoided.totalLockerVoided;
  const totalTransactionLockerVoidedAmount =
    totalTransactionVoided.totalTransactionLockerVoidedAmount;
  const totalGazeboVoided = totalTransactionVoided.totalGazeboVoided;
  const totalTransactionGazeboVoidedAmount =
    totalTransactionVoided.totalTransactionGazeboVoidedAmount;

  return {
    totalTicketTunai,
    totalDepositTunai,
    totalTopUpTunai,
    totalRefundTunai,
    totalSouvenirTunai,
    totalYearlyPassTunai,
    totalSwimmingClassTunai,
    totalTunaiTransaction,

    totalTicketNonTunai,
    totalDepositNonTunai,
    totalTopUpNonTunai,
    totalSouvenirNonTunai,
    totalYearlyPassNonTunai,
    totalSwimmingClassNonTunai,
    totalNonTunaiTransaction,

    totalTicketVoucher,
    totalLockerTransaction,
    totalGazeboTransaction,
    totalSwimsuitRentTransaction,
    totalSouvenirCashQ,

    totalCustomersTicketVoided,
    totalTransactionTicketVoidedAmount,
    totalSouvenirVoided,
    totalTransactionSouvenirVoidedAmount,
    totalSwimsuitRentVoided,
    totalTransactionSwimsuitRentVoidedAmount,
    totalLockerVoided,
    totalTransactionLockerVoidedAmount,
    totalGazeboVoided,
    totalTransactionGazeboVoidedAmount,
  };
}

async function getTotalDepositFromTicketSales({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalDepositTunai: number;
  totalDepositNonTunai: number;
}> {
  const totalDepositFromTicketSales = await db
    .select({
      totalDepositTunai: sql<string>`
          SUM(
            CASE
              WHEN ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
              THEN ${salesDetails.subtotal}
              ELSE 0
            END
          )
      `,
      totalDepositNonTunai: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
    })
    .from(salesDetails)
    .leftJoin(sales, eq(salesDetails.sales_id, sales.id))
    .leftJoin(payments, eq(salesDetails.sales_id, payments.sales_id))
    .where(
      and(
        eq(salesDetails.product_id, ProductConfig.wristband.id),
        eq(sales.transaction_type, SalesTransactionTypeEnum.TICKET_SALE),
        ...transactionfilters,
      ),
    );

  return {
    totalDepositTunai:
      Number(totalDepositFromTicketSales[0].totalDepositTunai) ?? 0,
    totalDepositNonTunai:
      Number(totalDepositFromTicketSales[0].totalDepositNonTunai) ?? 0,
  };
}

async function getTotalTransactionFromTicket({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalTunaiTransaction: number;
  totalNonTunaiTransaction: number;
}> {
  const totalTransaction = await db
    .select({
      totalTunaiTransaction: sql<string>`
    SUM(
      CASE
        WHEN ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
        THEN ${sales.grand_total}
        ELSE 0
      END
    )
  `,
      totalNonTunaiTransaction: sql<string>`
    SUM(
      CASE
        WHEN ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
        THEN ${sales.grand_total}
        ELSE 0
      END
    )
  `,
    })
    .from(sales)
    .leftJoin(payments, eq(payments.sales_id, sales.id))
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.TICKET_SALE),
        ...transactionfilters,
      ),
    );

  return {
    totalTunaiTransaction:
      Number(totalTransaction[0].totalTunaiTransaction) ?? 0,
    totalNonTunaiTransaction:
      Number(totalTransaction[0].totalNonTunaiTransaction) ?? 0,
  };
}

async function getTotalTransactionWristbandRent({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalDepositTunai: number;
  totalDepositNonTunai: number;
  totalTopUpTunai: number;
  totalTopUpNonTunai: number;
}> {
  const totalTransaction = await db
    .select({
      totalDepositTunai: sql<string>`
      SUM(
        CASE
          WHEN ${salesDetails.product_id} = ${ProductConfig.wristband.id}
            AND ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
          THEN ${salesDetails.subtotal}
          ELSE 0
        END
      )
    `,
      totalDepositNonTunai: sql<string>`
      SUM(
        CASE
          WHEN ${salesDetails.product_id} = ${ProductConfig.wristband.id}
            AND ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
          THEN ${salesDetails.subtotal}
          ELSE 0
        END
      )
    `,
      totalTopUpTunai: sql<string>`
      SUM(
        CASE
          WHEN ${salesDetails.product_id} = ${ProductConfig.top_up.id}
            AND ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
          THEN ${salesDetails.subtotal}
          ELSE 0
        END
      )
    `,
      totalTopUpNonTunai: sql<string>`
      SUM(
        CASE
          WHEN ${salesDetails.product_id} = ${ProductConfig.top_up.id}
            AND ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
          THEN ${salesDetails.subtotal}
          ELSE 0
        END
      )
    `,
    })
    .from(salesDetails)
    .leftJoin(sales, eq(salesDetails.sales_id, sales.id))
    .leftJoin(payments, eq(salesDetails.sales_id, payments.sales_id))
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.WRISTBAND_RENT),
        ...transactionfilters,
      ),
    );

  return {
    totalDepositTunai: Number(totalTransaction[0].totalDepositTunai) ?? 0,
    totalDepositNonTunai: Number(totalTransaction[0].totalDepositNonTunai) ?? 0,
    totalTopUpTunai: Number(totalTransaction[0].totalTopUpTunai) ?? 0,
    totalTopUpNonTunai: Number(totalTransaction[0].totalTopUpNonTunai) ?? 0,
  };
}

async function getTotalTransactionCashQTransaction({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalDepositTunai: number;
  totalDepositNonTunai: number;
  totalTopUpTunai: number;
  totalTopUpNonTunai: number;
  totalLockerTransaction: number;
  totalGazeboTransaction: number;
  totalSwimsuitRentTransaction: number;
}> {
  const totalTransaction = await db
    .select({
      totalDepositTunai: sql<string>`
        SUM(
          CASE
            WHEN ${salesDetails.product_id} = ${ProductConfig.wristband.id}
              AND ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
              AND ${sales.transaction_type} = ${SalesTransactionTypeEnum.BINDING_CASHQ}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalDepositNonTunai: sql<string>`
        SUM(
          CASE
            WHEN ${salesDetails.product_id} = ${ProductConfig.wristband.id}
              AND ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
              AND ${sales.transaction_type} = ${SalesTransactionTypeEnum.BINDING_CASHQ}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalTopUpTunai: sql<string>`
        SUM(
          CASE
            WHEN ${salesDetails.product_id} = ${ProductConfig.top_up.id}
              AND ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
              AND ${sales.transaction_type} = ${SalesTransactionTypeEnum.TOP_UP}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalTopUpNonTunai: sql<string>`
        SUM(
          CASE
            WHEN ${salesDetails.product_id} = ${ProductConfig.top_up.id}
              AND ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
              AND ${sales.transaction_type} = ${SalesTransactionTypeEnum.TOP_UP}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalLockerTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.LOCKER_RENT}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalGazeboTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.GAZEBO_RENT}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
      totalSwimsuitRentTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.SWIMSUIT_RENT}
            THEN ${salesDetails.subtotal}
            ELSE 0
          END
        )
      `,
    })
    .from(salesDetails)
    .leftJoin(sales, eq(salesDetails.sales_id, sales.id))
    .leftJoin(payments, eq(salesDetails.sales_id, payments.sales_id))
    .where(
      and(
        inArray(sales.transaction_type, [
          SalesTransactionTypeEnum.BINDING_CASHQ,
          SalesTransactionTypeEnum.TOP_UP,
          SalesTransactionTypeEnum.SWIMSUIT_RENT,
          SalesTransactionTypeEnum.LOCKER_RENT,
          SalesTransactionTypeEnum.GAZEBO_RENT,
        ]),
        ...transactionfilters,
      ),
    );

  return {
    totalDepositTunai: Number(totalTransaction[0].totalDepositTunai) ?? 0,
    totalDepositNonTunai: Number(totalTransaction[0].totalDepositNonTunai) ?? 0,
    totalTopUpTunai: Number(totalTransaction[0].totalTopUpTunai) ?? 0,
    totalTopUpNonTunai: Number(totalTransaction[0].totalTopUpNonTunai) ?? 0,
    totalLockerTransaction:
      Number(totalTransaction[0].totalLockerTransaction) ?? 0,
    totalGazeboTransaction:
      Number(totalTransaction[0].totalGazeboTransaction) ?? 0,
    totalSwimsuitRentTransaction:
      Number(totalTransaction[0].totalSwimsuitRentTransaction) ?? 0,
  };
}

async function getTotalTransactionSouvenir({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalTunaiTransaction: number;
  totalNonTunaiTransaction: number;
  totalCashqTransaction: number;
}> {
  const totalTransaction = await db
    .select({
      totalTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
      totalNonTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
              AND ${payments.payment_method} != ${PaymentMethodEnum.CASH_Q}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
      totalCashqTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} = ${PaymentMethodEnum.CASH_Q}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
    })
    .from(sales)
    .leftJoin(payments, eq(payments.sales_id, sales.id))
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.SOUVENIR_SALE),
        ...transactionfilters,
      ),
    );

  return {
    totalTunaiTransaction:
      Number(totalTransaction[0].totalTunaiTransaction) ?? 0,
    totalNonTunaiTransaction:
      Number(totalTransaction[0].totalNonTunaiTransaction) ?? 0,
    totalCashqTransaction:
      Number(totalTransaction[0].totalCashqTransaction) ?? 0,
  };
}

async function getTotalTransactionYearlyPass({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalTunaiTransaction: number;
  totalNonTunaiTransaction: number;
}> {
  const totalTransaction = await db
    .select({
      totalTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
      totalNonTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
    })
    .from(sales)
    .leftJoin(payments, eq(payments.sales_id, sales.id))
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.ENTRY_PASS),
        ...transactionfilters,
      ),
    );

  return {
    totalTunaiTransaction:
      Number(totalTransaction[0].totalTunaiTransaction) ?? 0,
    totalNonTunaiTransaction:
      Number(totalTransaction[0].totalNonTunaiTransaction) ?? 0,
  };
}

async function getTotalTransactionSwimmingClass({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalTunaiTransaction: number;
  totalNonTunaiTransaction: number;
}> {
  const totalTransaction = await db
    .select({
      totalTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} = ${PaymentMethodEnum.TUNAI}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
      totalNonTunaiTransaction: sql<string>`
        SUM(
          CASE
            WHEN ${payments.payment_method} != ${PaymentMethodEnum.TUNAI}
            THEN ${sales.grand_total}
            ELSE 0
          END
        )
      `,
    })
    .from(sales)
    .leftJoin(payments, eq(payments.sales_id, sales.id))
    .where(
      and(
        eq(sales.transaction_type, SalesTransactionTypeEnum.SWIMMING_CLASS),
        ...transactionfilters,
      ),
    );

  return {
    totalTunaiTransaction:
      Number(totalTransaction[0].totalTunaiTransaction) ?? 0,
    totalNonTunaiTransaction:
      Number(totalTransaction[0].totalNonTunaiTransaction) ?? 0,
  };
}

async function getTotalTransactionRefund({
  refundTransactionFilters,
}: {
  refundTransactionFilters: SQLWrapper[];
}): Promise<{
  totalRefund: number;
}> {
  const totalTransaction = await db
    .select({
      totalRefund: sql<string>`SUM(${walletCashRefunds.total_refund})`,
    })
    .from(walletCashRefunds)
    .where(and(...refundTransactionFilters));

  return {
    totalRefund: Number(-totalTransaction[0].totalRefund) ?? 0,
  };
}

async function getTotalTransactionVoided({
  transactionfilters,
}: {
  transactionfilters: SQLWrapper[];
}): Promise<{
  totalCustomersTicketVoided: number;
  totalTransactionTicketVoidedAmount: number;
  totalTransactionDepositVoidedAmount: number;
  totalSouvenirVoided: number;
  totalTransactionSouvenirVoidedAmount: number;
  totalSwimsuitRentVoided: number;
  totalTransactionSwimsuitRentVoidedAmount: number;
  totalLockerVoided: number;
  totalTransactionLockerVoidedAmount: number;
  totalGazeboVoided: number;
  totalTransactionGazeboVoidedAmount: number;
}> {
  const voidedQtySummary = await db
    .select({
      totalCustomersTicketVoided: sql<number>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.TICKET_SALE}
          AND ${salesDetails.product_id} != ${ProductConfig.wristband.id}
          THEN ${salesDetails.qty}
          ELSE 0
        END
      )`,
      totalTransactionDepositVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.TICKET_SALE}
          AND ${salesDetails.product_id} = ${ProductConfig.wristband.id}
          THEN ${salesDetails.subtotal}
          ELSE 0
        END
      )`,
      totalSouvenirVoided: sql<number>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.SOUVENIR_SALE}
          THEN ${salesDetails.qty}
          ELSE 0
        END
      )`,
      totalSwimsuitRentVoided: sql<number>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.SWIMSUIT_RENT}
          THEN ${salesDetails.qty}
          ELSE 0
        END
      )`,
      totalLockerVoided: sql<number>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.LOCKER_RENT}
          THEN ${salesDetails.qty}
          ELSE 0
        END
      )`,
      totalGazeboVoided: sql<number>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.GAZEBO_RENT}
          THEN ${salesDetails.qty}
          ELSE 0
        END
      )`,
    })
    .from(sales)
    .leftJoin(salesDetails, eq(salesDetails.sales_id, sales.id))
    .where(and(eq(sales.is_void, true), ...transactionfilters));

  const voidedAmountSummary = await db
    .select({
      totalTransactionTicketVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.TICKET_SALE}
          THEN ${sales.grand_total}
          ELSE 0
        END
      )`,
      totalTransactionSouvenirVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.SOUVENIR_SALE}
          THEN ${sales.grand_total}
          ELSE 0
        END
      )`,
      totalTransactionSwimsuitRentVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.SWIMSUIT_RENT}
          THEN ${sales.grand_total}
          ELSE 0
        END
      )`,
      totalTransactionLockerVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.LOCKER_RENT}
          THEN ${sales.grand_total}
          ELSE 0
        END
      )`,
      totalTransactionGazeboVoidedAmount: sql<string>`SUM(
        CASE
          WHEN ${sales.transaction_type} = ${SalesTransactionTypeEnum.GAZEBO_RENT}
          THEN ${sales.grand_total}
          ELSE 0
        END
      )`,
    })
    .from(sales)
    .where(and(eq(sales.is_void, true), ...transactionfilters));

  return {
    totalCustomersTicketVoided:
      Number(voidedQtySummary[0].totalCustomersTicketVoided) ?? 0,
    totalTransactionTicketVoidedAmount:
      Number(voidedAmountSummary[0].totalTransactionTicketVoidedAmount) ?? 0,
    totalTransactionDepositVoidedAmount:
      Number(voidedQtySummary[0].totalTransactionDepositVoidedAmount) ?? 0,
    totalSouvenirVoided: Number(voidedQtySummary[0].totalSouvenirVoided) ?? 0,
    totalTransactionSouvenirVoidedAmount:
      Number(voidedAmountSummary[0].totalTransactionSouvenirVoidedAmount) ?? 0,
    totalSwimsuitRentVoided:
      Number(voidedQtySummary[0].totalSwimsuitRentVoided) ?? 0,
    totalTransactionSwimsuitRentVoidedAmount:
      Number(voidedAmountSummary[0].totalTransactionSwimsuitRentVoidedAmount) ??
      0,
    totalLockerVoided: Number(voidedQtySummary[0].totalLockerVoided) ?? 0,
    totalTransactionLockerVoidedAmount:
      Number(voidedAmountSummary[0].totalTransactionLockerVoidedAmount) ?? 0,
    totalGazeboVoided: Number(voidedQtySummary[0].totalGazeboVoided) ?? 0,
    totalTransactionGazeboVoidedAmount:
      Number(voidedAmountSummary[0].totalTransactionGazeboVoidedAmount) ?? 0,
  };
}

function parseWIBDate(dateStr: string): Date {
  const local = new Date(dateStr); // ini dalam waktu lokal server
  const utcMillis = local.getTime() + 7 * 60 * 60 * 1000; // +7 jam
  return new Date(utcMillis);
}
