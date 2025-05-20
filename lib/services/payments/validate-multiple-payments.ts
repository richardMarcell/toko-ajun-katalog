import { db } from "@/db";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { Wallet } from "@/types/wallet";
import { WalletWristband } from "@/types/wallet-wristband";
import getQVoucherValue from "./get-q-voucher-value";

type Payment = {
  wristband_code?: string | null;
  cardholder_name?: string | null;
  debit_card_number?: string | null;
  referenced_id?: string | null;
  debit_issuer_bank?: string | null;
  credit_card_number?: string | null;
  qris_issuer?: string | null;
  q_voucher_codes?: string[];
  total_payment: number;
  method: PaymentMethodEnum;
};

type ValidateTotalPaymentProps = {
  payments: Payment[];
  grandTotal: number;
};

export async function validateMultiplePayments({
  payments,
  grandTotal,
}: ValidateTotalPaymentProps): Promise<{
  is_valid: boolean;
  message: string;
  total_payment: number;
}> {
  const { isSaldoCashQSufficient } = await checkSaldoCashQSufficient({
    payments,
  });

  if (!isSaldoCashQSufficient)
    return {
      is_valid: false,
      message: "Saldo CashQ tidak mencukupi untuk melakukan pembelian ini",
      total_payment: 0,
    };

  const qVoucherCodes =
    payments.find((p) => p.method === PaymentMethodEnum.Q_VOUCHER)
      ?.q_voucher_codes ?? [];

  const voucherList = getQVoucherValue(qVoucherCodes);

  const totalVoucherValue = voucherList.reduce(
    (sum, voucher) => sum + voucher.value,
    0,
  );

  if (qVoucherCodes.length > 0) {
    const { isTotalSaleGreaterThanVoucher } =
      await checkTotalSaleGreaterThanVoucher({
        grandTotal,
        totalVoucherValue,
      });

    if (!isTotalSaleGreaterThanVoucher) {
      return {
        is_valid: false,
        message:
          "Total tagihan harus lebih besar atau sama dengan nilai voucher",
        total_payment: 0,
      };
    }
  }

  const totalPayment = calculateTotalPayment({ payments, voucherList });

  const { isTotalAllPaymentsSufficient } = checkTotalAllPaymentsSufficient({
    totalPayment,
    grandTotal,
  });

  if (!isTotalAllPaymentsSufficient)
    return {
      is_valid: false,
      message:
        "Nominal pembayaran harus lebih besar atau sama dengan total keseluruhan",
      total_payment: 0,
    };

  return {
    is_valid: true,
    message: "",
    total_payment: totalPayment,
  };
}

function calculateTotalPayment({
  payments,
  voucherList,
}: {
  payments: Payment[];
  voucherList: { code: string; value: number }[];
}): number {
  const voucherTotal = voucherList.reduce(
    (sum, voucher) => sum + voucher.value,
    0,
  );

  const nonVoucherTotal = payments.reduce((sum, payment) => {
    if (payment.method === PaymentMethodEnum.Q_VOUCHER) return sum;
    return sum + payment.total_payment;
  }, 0);

  return nonVoucherTotal + voucherTotal;
}

async function getWalletWristbandList(
  wristbandCode: string,
): Promise<(WalletWristband & { wallet: Wallet }) | null> {
  const walletWristband = await db.query.walletWristband.findFirst({
    where: (walletWristband, { eq, and }) =>
      and(
        eq(walletWristband.wristband_code, wristbandCode),
        eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
      ),
    with: {
      wallet: true,
    },
  });

  if (!walletWristband) return null;

  return walletWristband;
}

async function checkSaldoCashQSufficient({
  payments,
}: {
  payments: Payment[];
}): Promise<{ isSaldoCashQSufficient: boolean }> {
  const paymentCashQ = payments.find(
    (payment) => payment.method === PaymentMethodEnum.CASH_Q,
  );

  if (paymentCashQ && paymentCashQ.wristband_code) {
    const walletWristband = await getWalletWristbandList(
      paymentCashQ.wristband_code,
    );
    const saldoWallet = Number(walletWristband.wallet.saldo);

    const isSaldoWalletSufficient = saldoWallet >= paymentCashQ.total_payment;
    if (!isSaldoWalletSufficient)
      return {
        isSaldoCashQSufficient: false,
      };
  }

  return {
    isSaldoCashQSufficient: true,
  };
}

async function checkTotalSaleGreaterThanVoucher({
  grandTotal,
  totalVoucherValue,
}: {
  grandTotal: number;
  totalVoucherValue: number;
}): Promise<{ isTotalSaleGreaterThanVoucher: boolean }> {
  const isTotalSaleGreaterThanVoucher = grandTotal >= totalVoucherValue;

  if (!isTotalSaleGreaterThanVoucher) {
    return {
      isTotalSaleGreaterThanVoucher: false,
    };
  }

  return {
    isTotalSaleGreaterThanVoucher: true,
  };
}

function checkTotalAllPaymentsSufficient({
  totalPayment,
  grandTotal,
}: {
  totalPayment: number;
  grandTotal: number;
}): { isTotalAllPaymentsSufficient: boolean } {
  const isTotalPaymentValid = totalPayment >= grandTotal;
  if (!isTotalPaymentValid)
    return {
      isTotalAllPaymentsSufficient: false,
    };

  return {
    isTotalAllPaymentsSufficient: true,
  };
}
