import { db } from "@/db";
import { DebitIssuerBankEnum } from "@/lib/enums/DebitIssuerBankEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { getPaymentMethodOnRestoPatio } from "@/lib/services/payments/get-payment-method";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import * as yup from "yup";

export const storeSalesValidationSchema = yup.object({
  resto_sales_temporary: yup.object({
    captain_order_id: yup
      .number()
      .required("ID Captain order wajib diisi")
      .typeError("ID Captain order wajib diisi dengan karakter yang valid")
      .test(
        "is-captain-order-exists",
        "Captain order tidak terdaftar dalam sistem",
        async function (captainOrderId) {
          const captainOrder = await db.query.captainOrders.findFirst({
            where: (captainOrders, { eq }) =>
              eq(captainOrders.id, BigInt(captainOrderId)),
          });

          if (!captainOrder) return false;
          return true;
        },
      ),
    sales_details: yup
      .array()
      .of(
        yup.object().shape({
          product_id: yup
            .number()
            .required("Produk wajib diisi")
            .typeError("Produk wajib diisi dengan karakter yang valid")
            .test(
              "is-product-exists",
              "Produk tidak terdaftar dalam sistem",
              async function (productId) {
                const product = await db.query.products.findFirst({
                  where: (products, { eq }) =>
                    eq(products.id, BigInt(productId)),
                });

                if (!product) return false;
                return true;
              },
            ),
          qty: yup
            .number()
            .required("Kuantitas produk wajib diisi")
            .typeError("Kuantitas produk wajib diisi dengan angka yang valid")
            .min(0, "Kuantitas produk tidak boleh kurang dari 0"),
          product_name: yup
            .string()
            .typeError("Nama produk wajib diisi dengan karakter yang valid")
            .required("Nama produk wajib diisi"),
          price: yup
            .number()
            .required("Harga produk wajib diisi")
            .typeError("Harga produk wajib diisi dengan angka yang valid"),
          note: yup
            .string()
            .typeError("Catatan wajib diisi dengan karakter yang valid")
            .nullable(),
        }),
      )
      .test(
        "at-least-one-qty-valid",
        "Setidaknya harus membayar minimal 1 produk.",
        function (items) {
          if (!items || !Array.isArray(items)) return false;
          return items.some((item) => item.qty && item.qty >= 1);
        },
      )
      .required("Item tagihan wajib diisi")
      .min(1, "Wajib membayar setidaknya 1 item produk"),
    discount_amount: yup
      .number()
      .typeError("Jumlah diskon wajib diisi dengan angka yang valid")
      .required("Jumlah diskon wajib diisi"),
    discount_percent: yup
      .number()
      .typeError("Persen diskon wajib diisi dengan angka yang valid")
      .required("Persen diskon wajib diisi"),
    tax_amount: yup
      .number()
      .typeError("Jumlah pajak wajib diisi dengan angka yang valid")
      .required("Jumlah pajak wajib diisi"),
    tax_percent: yup
      .number()
      .typeError("Persen pajak wajib diisi dengan angka yang valid")
      .required("Persen pajak wajib diisi"),
    total_net: yup
      .number()
      .typeError("Total penjualan bersih diisi dengan angka yang valid")
      .required("Total penjualan bersih diisi"),
    total_gross: yup
      .number()
      .typeError("Total penjualan kotor wajib diisi dengan angka yang valid")
      .required("Total penjualan kotor wajib diisi"),
    grand_total: yup
      .number()
      .typeError("Total keseluruhan wajib diisi dengan angka yang valid")
      .required("Total keseluruhan wajib diisi"),
  }),
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan karakter yang valid")
    .nullable()
    .test({
      name: "is-promo-code-exist",
      skipAbsent: true,
      async test(promoCode) {
        if (!promoCode) return true;

        const { promo } = await getValidPromo(promoCode);

        if (!promo) return false;
        return true;
      },
      message:
        "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
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
            getPaymentMethodOnRestoPatio(),
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
