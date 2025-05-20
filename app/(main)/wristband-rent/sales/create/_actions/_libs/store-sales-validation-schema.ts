import { DebitIssuerBankEnum } from "@/lib/enums/DebitIssuerBankEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import * as yup from "yup";

export const storeSalesValidationSchema = yup.object({
  wristband_rent: yup.object({
    quantity: yup
      .number()
      .typeError("Jumlah wajib diisi dengan angka yang valid")
      .required("Jumlah wajib diisi"),
    saldo: yup.number().typeError("Saldo wajib diisi dengan angka yang valid"),
    customer_name: yup
      .string()
      .max(255, "Nama pelanggan tidak boleh lebih dari 255 karakter")
      .required("Nama pelanggan wajib dipilih"),
    customer_phone_number: yup
      .string()
      .max(15, "No. HP pelanggan tidak boleh lebih dari 15 karakter")
      .required("No. HP pelanggan wajib dipilih"),
    wristband_rent_code: yup
      .array()
      .of(yup.string().required())
      .required("Detail penjualan wajib diisi")
      .min(1, "Wajib memilih setidaknya 1 produk untuk dipesan"),
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
            getPaymentMethod({ isIncludeCashQ: false }),
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
