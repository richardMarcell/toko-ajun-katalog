import { payments, walletHistories, wallets } from "@/db/schema";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { WalletTransactionTypeEnum } from "@/lib/enums/WalletTransactionTypeEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { DatabaseTransaction } from "@/types/db-transaction";
import { eq } from "drizzle-orm";
import { getUserAuthenticated } from "../auth/get-user-authenticated";
import { db } from "@/db";
import storeTransferBillToScm from "./store-transfer-bill-to-scm";
import storeQVoucherToScm from "./store-q-voucher-to-scm";
import { paymentVouchers } from "@/db/schema/payment-vouchers";
import getQVoucherValue from "./get-q-voucher-value";

type StorePaymentProps = {
  tx: DatabaseTransaction;
  salesId: bigint;
  paymentSummary: {
    total_payment: number;
    change_amount: number;
    payment_method: PaymentMethodEnum;

    // OTA Redemption
    ota_redeem_code?: string | null;
    vendor_type_code?: string | null;

    // CashQ
    wristband_code?: string | null;
    wallet_transaction_type?: WalletTransactionTypeEnum;

    // Debit
    debit_issuer_bank?: string | null;
    cardholder_name?: string | null;
    debit_card_number?: string | null;
    referenced_id?: string | null;

    // Credit Card
    credit_card_number?: string | null;

    // Qris
    qris_issuer?: string | null;

    // Q Voucher
    q_voucher_codes?: string[];
  };
};

export async function storePayment({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<{ walletHistoryId?: bigint }> {
  switch (paymentSummary.payment_method) {
    case PaymentMethodEnum.TUNAI:
      await storePaymentWithTunaiPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.CASH_Q:
      const { walletHistoryId } = await storePaymentWithCashQPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId };

    case PaymentMethodEnum.DEBIT:
      await storePaymentWithDebitPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.OTA_REDEMPTION:
      await storePaymentWithOtaRedemptionPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.CREDIT_CARD:
      await storePaymentWithCreditCardPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.DEPOSIT:
      await storePaymentWithDepositPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.QRIS:
      await storePaymentWithQrisPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.TRANSFER_BILL:
      await storePaymentWithTransferBillPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    case PaymentMethodEnum.Q_VOUCHER:
      await storePaymentWithQVoucherPaymentMethod({
        paymentSummary,
        salesId,
        tx,
      });
      return { walletHistoryId: undefined };

    default:
      throw new Error(
        `Unhandled payment method: ${paymentSummary.payment_method}`,
      );
  }
}

async function storePaymentWithTunaiPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithCashQPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<{ walletHistoryId: bigint }> {
  const walletWristbandList = await getWalletWristbandList(
    paymentSummary.wristband_code as string,
  );

  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
    wristband_code: paymentSummary.wristband_code,
    wallet_id: walletWristbandList[0].wallet_id,
  };
  await tx.insert(payments).values(dataPaymentToInsert);

  const { walletHistoryId } = await proccessCashQTransaction({
    tx,
    salesId,
    paymentSummary,
  });

  return { walletHistoryId: walletHistoryId };
}

async function storePaymentWithDebitPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
    cardholder_name: paymentSummary.cardholder_name,
    debit_card_number: paymentSummary.debit_card_number,
    debit_issuer_bank: paymentSummary.debit_issuer_bank,
    referenced_id: paymentSummary.referenced_id,
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithOtaRedemptionPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
    ota_redeem_code: paymentSummary.ota_redeem_code,
    vendor_type_code: paymentSummary.vendor_type_code,
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithCreditCardPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
    credit_card_number: paymentSummary.credit_card_number,
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithDepositPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithQrisPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
    qris_issuer: paymentSummary.qris_issuer,
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithTransferBillPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  await storeTransferBillToScm();

  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: paymentSummary.total_payment.toString(),
    change_amount: paymentSummary.change_amount.toString(),
  };
  await tx.insert(payments).values(dataPaymentToInsert);
}

async function storePaymentWithQVoucherPaymentMethod({
  paymentSummary,
  salesId,
  tx,
}: StorePaymentProps): Promise<void> {
  await storeQVoucherToScm();

  const vouchers = getQVoucherValue(paymentSummary.q_voucher_codes);

  const totalValueVoucher = vouchers.reduce(
    (sum, voucher) => sum + voucher.value,
    0,
  );

  const dataPaymentToInsert: typeof payments.$inferInsert = {
    sales_id: salesId,
    payment_method: paymentSummary.payment_method,
    total_payment: totalValueVoucher.toString(),
    change_amount: paymentSummary.change_amount.toString(),
  };
  const paymentStored = await tx
    .insert(payments)
    .values(dataPaymentToInsert)
    .$returningId();

  await tx.insert(paymentVouchers).values(
    vouchers.map((voucher) => ({
      payment_id: paymentStored[0].id,
      code: voucher.code,
      amount: voucher.value.toString(),
    })),
  );
}

async function proccessCashQTransaction({
  tx,
  paymentSummary,
  salesId,
}: StorePaymentProps): Promise<{ walletHistoryId: bigint }> {
  const user = await getUserAuthenticated();
  if (!user) throw new Error("Use is not authenticated");
  const walletWristbandList = await getWalletWristbandList(
    paymentSummary.wristband_code as string,
  );

  await tx
    .update(wallets)
    .set({
      saldo: (
        Number(walletWristbandList[0].wallet.saldo) -
        paymentSummary.total_payment
      ).toString(),
    })
    .where(eq(wallets.id, walletWristbandList[0].wallet_id));

  const walletHistory = await tx
    .insert(walletHistories)
    .values({
      sale_id: salesId,
      wallet_id: walletWristbandList[0].wallet_id,
      prev_saldo: walletWristbandList[0].wallet.saldo,
      current_saldo: (
        Number(walletWristbandList[0].wallet.saldo) -
        paymentSummary.total_payment
      ).toString(),
      amount: (-paymentSummary.total_payment).toString(),
      transaction_type: paymentSummary.wallet_transaction_type as string,
      created_by: BigInt(user.id),
    })
    .$returningId();

  return { walletHistoryId: walletHistory[0].id };
}

async function getWalletWristbandList(wristbandCode: string) {
  const walletWristbandList = await db.query.walletWristband.findMany({
    where: (walletWristband, { eq, and }) =>
      and(
        eq(walletWristband.wristband_code, wristbandCode),
        eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
      ),
    with: {
      wallet: true,
    },
  });

  return walletWristbandList;
}
