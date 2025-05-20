import { db } from "@/db";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";

type ValidateTotalPaymentProps = {
  paymentMethod: PaymentMethodEnum;
  wristbandCode?: string | null;
  totalPayment: number;
  grandTotal: number;
};

export async function validatePayment({
  paymentMethod,
  wristbandCode,
  totalPayment,
  grandTotal,
}: ValidateTotalPaymentProps): Promise<{
  is_valid: boolean;
  message: string;
}> {
  if (paymentMethod === PaymentMethodEnum.TUNAI) {
    const isTotalPaymentValid = totalPayment >= grandTotal;
    if (!isTotalPaymentValid)
      return {
        is_valid: false,
        message:
          "Nominal pembayaran harus lebih besar atau sama dengan total keseluruhan",
      };
  }

  if (paymentMethod === PaymentMethodEnum.CASH_Q && wristbandCode) {
    const walletWristbandList = await getWalletWristbandList(wristbandCode);
    const saldoWallet = Number(walletWristbandList[0].wallet.saldo);
    const isSaldoWalletSufficient = saldoWallet >= grandTotal;
    if (!isSaldoWalletSufficient)
      return {
        is_valid: false,
        message: "Saldo CashQ tidak mencukupi untuk melakukan pembelian ini",
      };
  }

  return {
    is_valid: true,
    message: "",
  };
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
