import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";
import { DebitIssuerBankEnum } from "@/lib/enums/DebitIssuerBankEnum";
import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { ProductStockTypeEnum } from "@/lib/enums/ProductStockTypeEnum";
import { QrisIssuerEnum } from "@/lib/enums/QrisIssuerEnum";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import getPaymentMethod from "@/lib/services/payments/get-payment-method";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeSalesSignlePaymentValidationSchema = yup.object({
  sales_temporary_origin: yup.object({
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
    table_number: yup
      .string()
      .typeError("Nomor meja wajib dipilih dengan pilihan yang valid")
      .test(
        "is-required",
        "Nomor meja wajib dipilih ketika tipe pesanan adalah DINE IN",
        function (value) {
          const orderType = this.parent.order_type;

          if (orderType === OrderTypeEnum.DINE_IN) return !!value;

          return true;
        },
      )
      .nullable(),
    order_type: yup
      .string()
      .oneOf(
        ["DINE IN", "TAKE AWAY"],
        "Tipe pesanan yang diterima hanya Dine In dan Take Away",
      )
      .required("Tipe pesanan wajib dipilih"),
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
              async test(id) {
                if (!id) return true;

                const product = await db.query.products.findFirst({
                  where: (products, { eq }) => eq(products.id, BigInt(id)),
                });

                if (!product) return false;

                return true;
              },
              message: "Produk tidak ditemukan",
            })
            .test({
              name: "is-product-sufficient",
              skipAbsent: true,
              async test(id) {
                if (!id) return true;

                const stock = await db.query.stocks.findFirst({
                  where: (stocks, { eq, and }) =>
                    and(
                      eq(stocks.product_id, BigInt(id)),
                      eq(
                        stocks.warehouse_id,
                        SateliteUnitConfig.food_corner.warehouse_id,
                      ),
                    ),
                  with: {
                    product: true,
                  },
                });

                if (!stock || !stock.product) {
                  return this.createError({
                    message: `Produk tidak ditemukan.`,
                  });
                }

                if (stock.product.stock_type === ProductStockTypeEnum.NON_STOCK)
                  return true;

                const selectedProductQty = this.parent.qty;
                const availableStock = Number(stock.qty);

                if (availableStock < selectedProductQty) {
                  return this.createError({
                    message: `Stok untuk produk ${stock.product.name} tidak mencukupi.`,
                  });
                }

                return true;
              },
            }),
          qty: yup
            .number()
            .typeError("Kuantitas wajib diisi dengan angka yang valid")
            .required("Kuantitas wajib diisi"),
          price: yup
            .number()
            .typeError("Harga satuan wajib diisi dengan angka yang valid")
            .required("Harga satuan wajib diisi"),
          note: yup
            .string()
            .typeError("Catatan wajib diisi dengan karakter yang valid")
            .nullable(),
        }),
      )
      .required("Detail penjualan wajib diisi")
      .min(1, "Wajib memilih setidaknya 1 produk untuk dipesan"),
  }),
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan angka yang valid")
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
  payment_method: yup
    .string()
    .oneOf(
      getPaymentMethod(),
      "Metode pembayaran yang diterima hanya Tunai, Debit, Qris, Credit Card atau CashQ",
    )
    .required("Metode pembayaran wajib dipilih"),
  total_payment: yup
    .number()
    .required("Nominal pembayaran wajib diisi")
    .typeError("Nominal pembayaran wajib diisi dengan karakter yang valid"),
  credit_card_number: yup
    .string()
    .typeError("Nomor kartu wajib diisi dengan karakter yang valid")
    .nullable()
    .test(
      "is-required",
      "Nomor Kartu Wajib Diisi",
      function (cardNumberRequest) {
        const paymentMethod = this.parent.payment_method;
        const cardNumber = cardNumberRequest ? cardNumberRequest : "";

        if (
          paymentMethod == PaymentMethodEnum.CREDIT_CARD &&
          cardNumber.length < 1
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
      const paymentMethod = this.parent.payment_method;
      const bank = bankRequest ? bankRequest : "";

      if (paymentMethod == PaymentMethodEnum.DEBIT && bank.length < 1) {
        return false;
      }

      return true;
    })
    .test("is-valid", "Bank yang dipilih tidak valid", function (bankRequest) {
      const paymentMethod = this.parent.payment_method;
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
    }),
  debit_card_number: yup
    .string()
    .typeError("Nomor kartu wajib diisi dengan karakter yang valid")
    .nullable()
    .test(
      "is-required",
      "Nomor Kartu Wajib Diisi",
      function (cardNumberRequest) {
        const paymentMethod = this.parent.payment_method;
        const cardNumber = cardNumberRequest ? cardNumberRequest : "";

        if (paymentMethod == PaymentMethodEnum.DEBIT && cardNumber.length < 1) {
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
        const paymentMethod = this.parent.payment_method;
        const cardHolderName = cardholderNameRequest
          ? cardholderNameRequest
          : "";

        if (
          paymentMethod == PaymentMethodEnum.DEBIT &&
          cardHolderName.length < 1
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
        const paymentMethod = this.parent.payment_method;
        const referencedId = referencedIdRequest ? referencedIdRequest : "";

        if (
          paymentMethod == PaymentMethodEnum.DEBIT &&
          referencedId.length < 1
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
        const paymentMethod = this.parent.payment_method;
        const wristbandCode = wristbandCodeRequest ? wristbandCodeRequest : "";

        if (
          paymentMethod == PaymentMethodEnum.CASH_Q &&
          wristbandCode.length < 1
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
        const walletWristbandList = await db.query.walletWristband.findMany({
          where: (walletWristband, { eq, and }) =>
            and(
              eq(walletWristband.wristband_code, code),
              eq(walletWristband.status, WalletWristbandStatusEnum.OPEN),
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

        if (walletWristbandList[0].wallet.status !== WalletStatusEnum.OPEN) {
          return this.createError({
            message: "Wallet yang didaftarkan pada CashQ sudah tidak aktif",
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
        const paymentMethod = this.parent.payment_method;
        const qrisIssuer = qrisIssuerRequest ? qrisIssuerRequest : "";

        if (paymentMethod == PaymentMethodEnum.QRIS && qrisIssuer.length < 1) {
          return false;
        }

        return true;
      },
    )
    .test(
      "is-valid",
      "Penyedia Qris yang dipilih tidak valid",
      function (qrisIssuerRequest) {
        const paymentMethod = this.parent.payment_method;
        const qrisIssuer = qrisIssuerRequest ? qrisIssuerRequest : "";

        if (
          paymentMethod == PaymentMethodEnum.QRIS &&
          qrisIssuer.length > 0 &&
          !Object.values(QrisIssuerEnum).includes(qrisIssuer as QrisIssuerEnum)
        ) {
          return false;
        }

        return true;
      },
    ),
});
