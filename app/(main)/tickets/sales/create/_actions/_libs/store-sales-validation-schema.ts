import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { DebitIssuerBankEnum } from "@/lib/enums/DebitIssuerBankEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeSalesValidationSchema = yup.object({
  ticket_sales_temporary: yup.object({
    customer_name: yup
      .string()
      .max(255, "Nama pelanggan tidak boleh lebih dari 255 karakter")
      .required("Nama pelanggan wajib diisi"),
    customer_phone_number: yup
      .string()
      .max(255, "Nomor telepon tidak boleh lebih dari 255 karakter")
      .required("Nomor telepon wajib diisi"),
    customer_origin_id: yup
      .number()
      .typeError("Tempat asal wajib diisi dengan karakter yang valid")
      .required("Tempat asal wajib dipilih")
      .test({
        name: "is-customer-origin-exists",
        skipAbsent: true,
        async test(customerOriginId) {
          if (!customerOriginId) return true;

          const customerOrigin = await db.query.customerOrigins.findFirst({
            where: (customerOrigins, { eq }) =>
              eq(customerOrigins.id, BigInt(customerOriginId)),
          });

          if (customerOrigin) return true;

          return false;
        },
        message:
          "Tempat asal yang dipilih tidak valid atau tidak terdaftar dalam sistem",
      }),
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
    sales_details: yup
      .array()
      .of(
        yup.object().shape({
          product_id: yup
            .number()
            .typeError("Produk wajib dipilih dengan pilihan yang valid")
            .required("Produk wajib diisi")
            .test({
              name: "is-product-exists",
              skipAbsent: true,
              async test(productId) {
                if (!productId) return true;

                const product = await db.query.products.findFirst({
                  where: (products, { eq }) =>
                    eq(products.id, BigInt(productId)),
                });

                if (product) return true;

                return false;
              },
              message:
                "Produk yang dipilih tidak valid atau tidak terdaftar dalam sistem",
            }),
          code: yup
            .string()
            .typeError("Kode produk wajib diisi dengan pilihan yang valid")
            .required("Kode produk wajib diisi")
            .test({
              name: "is-product-exists",
              skipAbsent: true,
              async test(productCode) {
                if (!productCode) return true;

                const product = await db.query.products.findFirst({
                  where: (products, { eq }) => eq(products.code, productCode),
                });

                if (product) return true;

                return false;
              },
              message:
                "Kode Produk yang dipilih tidak valid atau tidak terdaftar dalam sistem",
            }),
          name: yup
            .string()
            .typeError("Nama produk wajib diisi dengan karakter yang valid")
            .required("Nama produk wajib diisi"),
          description: yup
            .string()
            .typeError(
              "Deskripsi produk wajib diisi dengan karakter yang valid",
            )
            .required("Deskripsi produk wajib diisi"),
          qty: yup
            .number()
            .typeError("Kuantitas wajib diisi dengan angka yang valid")
            .required("Kuantitas wajib diisi"),
          price: yup
            .number()
            .typeError("Harga satuan wajib diisi dengan angka yang valid")
            .required("Harga satuan wajib diisi"),
        }),
      )
      .required("Tiket wajib diisi")
      .min(1, "Wajib memilih setidaknya 1 tiket untuk dipesan"),
    is_festive: yup.boolean().required("Festive wajib diisi"),
    wristband_qty: yup
      .number()
      .typeError("Kuantitas gelang wajib diisi dengan angka yang valid")
      .min(0)
      .required("Kuantitas gelang wajib diisi"),
    total_deposit: yup
      .number()
      .typeError("Total deposit wajib diisi dengan angka yang valid")
      .required("Total deposit wajib diisi"),
    wristband_code_list: yup
      .array()
      .of(
        yup
          .string()
          .test(
            "is-wristband-available",
            "CashQ belum dikembalikan, silakan melakukan pengembalian CashQ",
            async function (code) {
              if (!code) return true;

              const wristband = await db.query.wristbands.findFirst({
                where: eq(wristbands.code, code),
              });

              if (!wristband) return false;
              if (wristband.status === WristbandStatusEnum.IN_USE) return false;

              return true;
            },
          )
          .required("Kode gelang wajib diisi"),
      )
      .test("is-required", "Kode gelang wajib diisi", function (codeList) {
        const wristbandQty = this.parent.wristband_qty;
        if (wristbandQty < 1) return true;

        if (!codeList) return false;

        if (wristbandQty > 0 && codeList.length < 1) return false;

        return true;
      })
      .required("Kode gelang wajib diisi"),
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
