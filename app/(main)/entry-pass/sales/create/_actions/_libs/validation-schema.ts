import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { DebitIssuerBankEnum } from "@/lib/enums/DebitIssuerBankEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const validationSchema = yup.object({
  entry_pass_customer_history_id: yup
    .number()
    .required("entry_pass_customer_history_id wajib disertakan")
    .test({
      name: "is-id-exists",
      skipAbsent: true,
      async test(id) {
        if (!id) return false;

        const entryPassCustomerHistory =
          await db.query.entryPassCustomerHistories.findFirst({
            where: (entryPassCustomerHistories, { eq }) =>
              eq(entryPassCustomerHistories.id, BigInt(id)),
          });

        if (!entryPassCustomerHistory) return false;

        return true;
      },
      message:
        "Data riwayat entry pass dari ID yang Dikirimkan Tidak Ditemukan",
    }),
  payments: yup
    .array()
    .min(1, "Pembayaran wajib lebih dari satu")
    .required("Pembayaran wajib diisi")
    .of(
      yup.object().shape({
        method: yup
          .string()
          .oneOf(
            getPaymentMethod(),
            "Metode pembayaran yang diterima hanya Tunai, Debit, Qris, Credit Card atau CashQ",
          )
          .required("Metode pembayaran wajib dipilih"),
        total_payment: yup
          .number()
          .required("Nominal pembayaran wajib diisi")
          .typeError(
            "Nominal pembayaran wajib diisi dengan karakter yang valid",
          ),
        credit_card_number: yup
          .string()
          .typeError("Nomor kartu wajib diisi dengan karakter yang valid")
          .nullable()
          .test(
            "is-required",
            "Nomor Kartu Wajib Diisi",
            function (cardNumberRequest) {
              const paymentMethod = this.parent.method;
              const cardNumber = cardNumberRequest ? cardNumberRequest : "";

              if (
                paymentMethod == PaymentMethodEnum.CREDIT_CARD &&
                cardNumber === ""
              ) {
                return false;
              }

              return true;
            },
          ),
        debit_issuer_bank: yup
          .string()
          .typeError("Bank wajib dipilih dengan pilihan yang valid")
          .nullable()
          .test("is-required", "Bank Wajib Diisi", function (bankRequest) {
            const paymentMethod = this.parent.method;
            const bank = bankRequest ? bankRequest : "";

            if (paymentMethod == PaymentMethodEnum.DEBIT && bank === "") {
              return false;
            }

            return true;
          })
          .test(
            "is-valid",
            "Bank yang dipilih tidak valid",
            function (bankRequest) {
              const paymentMethod = this.parent.method;
              const bank = bankRequest ? bankRequest : "";

              if (
                paymentMethod == PaymentMethodEnum.DEBIT &&
                bank.length > 0 &&
                !Object.values(DebitIssuerBankEnum).includes(
                  bank as DebitIssuerBankEnum,
                )
              ) {
                return false;
              }

              return true;
            },
          ),
        debit_card_number: yup
          .string()
          .typeError("Nomor kartu wajib diisi dengan karakter yang valid")
          .nullable()
          .test(
            "is-required",
            "Nomor Kartu Wajib Diisi",
            function (cardNumberRequest) {
              const paymentMethod = this.parent.method;
              const cardNumber = cardNumberRequest ? cardNumberRequest : "";

              if (
                paymentMethod == PaymentMethodEnum.DEBIT &&
                cardNumber === ""
              ) {
                return false;
              }

              return true;
            },
          ),
        cardholder_name: yup
          .string()
          .typeError("Pengguna Kartu wajib diisi dengan karakter yang valid")
          .nullable()
          .test(
            "is-required",
            "Pengguna Kartu Wajib Diisi",
            function (cardholderNameRequest) {
              const paymentMethod = this.parent.method;
              const cardHolderName = cardholderNameRequest
                ? cardholderNameRequest
                : "";

              if (
                paymentMethod == PaymentMethodEnum.DEBIT &&
                cardHolderName === ""
              ) {
                return false;
              }

              return true;
            },
          ),
        referenced_id: yup
          .string()
          .typeError("Referenced Id wajib diisi dengan karakter yang valid")
          .nullable()
          .test(
            "is-required",
            "Referenced Id Wajib Diisi",
            function (referencedIdRequest) {
              const paymentMethod = this.parent.method;
              const referencedId = referencedIdRequest
                ? referencedIdRequest
                : "";

              if (
                paymentMethod == PaymentMethodEnum.DEBIT &&
                referencedId === ""
              ) {
                return false;
              }

              return true;
            },
          ),
        wristband_code: yup
          .string()
          .typeError("Kode CashQ wajib diisi dengan karakter yang valid")
          .nullable()
          .test(
            "is-required",
            "Kode CashQ Wajib Diisi",
            function (wristbandCodeRequest) {
              const paymentMethod = this.parent.method;
              const wristbandCode = wristbandCodeRequest
                ? wristbandCodeRequest
                : "";

              if (
                paymentMethod == PaymentMethodEnum.CASH_Q &&
                wristbandCode === ""
              ) {
                return false;
              }

              return true;
            },
          )
          .test(
            "is-wristband-available",
            "CashQ tidak terdaftar dalam sistem",
            async function (wristbandCode) {
              if (!wristbandCode) return true;

              const wristband = await db.query.wristbands.findFirst({
                where: eq(wristbands.code, wristbandCode),
              });

              if (!wristband) return false;

              return true;
            },
          )
          .test({
            name: "is-wallet-valid",
            skipAbsent: true,
            async test(code) {
              if (!code) return true;
              const walletWristbandList =
                await db.query.walletWristband.findMany({
                  where: (walletWristband, { eq, and }) =>
                    and(
                      eq(walletWristband.wristband_code, code),
                      eq(
                        walletWristband.status,
                        WalletWristbandStatusEnum.OPEN,
                      ),
                    ),
                  with: {
                    wallet: true,
                  },
                });

              if (walletWristbandList.length === 0) {
                return this.createError({
                  message: "Kode CashQ tidak memiliki akun wallet yang aktif",
                });
              }

              if (walletWristbandList.length > 1) {
                return this.createError({
                  message:
                    "Kode CashQ masih terdaftar pada lebih dari satu wallet yang aktif",
                });
              }

              if (
                walletWristbandList[0].wallet.status !== WalletStatusEnum.OPEN
              ) {
                return this.createError({
                  message:
                    "Wallet yang didaftarkan pada CashQ sudah tidak aktif",
                });
              }

              return true;
            },
          }),
        qris_issuer: yup
          .string()
          .typeError("Penyedia Qris wajib dipilih dengan pilihan yang valid")
          .nullable()
          .test(
            "is-required",
            "Penyedia Qris Wajib Diisi",
            function (qrisIssuerRequest) {
              const paymentMethod = this.parent.method;
              const qrisIssuer = qrisIssuerRequest ? qrisIssuerRequest : "";

              if (
                paymentMethod == PaymentMethodEnum.QRIS &&
                qrisIssuer === ""
              ) {
                return false;
              }

              return true;
            },
          )
          .test(
            "is-valid",
            "Penyedia Qris yang dipilih tidak valid",
            function (qrisIssuerRequest) {
              const paymentMethod = this.parent.method;
              const qrisIssuer = qrisIssuerRequest ? qrisIssuerRequest : "";

              if (
                paymentMethod == PaymentMethodEnum.QRIS &&
                qrisIssuer.length > 0 &&
                !Object.values(QrisIssuerEnum).includes(
                  qrisIssuer as QrisIssuerEnum,
                )
              ) {
                return false;
              }

              return true;
            },
          ),
        q_voucher_codes: yup
          .array()
          .of(
            yup
              .string()
              .trim()
              .required("Kode voucher wajib Diisi")
              .min(1, "Kode voucher tidak boleh kosong")
              .typeError("Kode voucher wajib diisi dengan karakter yang valid"),
          ),
      }),
    ),
});
