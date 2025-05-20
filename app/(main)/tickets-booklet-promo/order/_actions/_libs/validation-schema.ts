import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { getValidBooklet } from "@/repositories/domain/general/get-valid-booklet";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const validationSchema = yup.object({
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
                where: (products, { eq }) => eq(products.id, BigInt(productId)),
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
          .typeError("Deskripsi produk wajib diisi dengan karakter yang valid")
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
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan karakter yang valid")
    .required("Kode promo wajib diisi")
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
  booklet_code: yup
    .string()
    .typeError("Kode booklet wajib diisi dengan karakter yang valid")
    .nullable()
    .test({
      name: "is-booklet-code-valid",
      skipAbsent: true,
      async test(bookletCode) {
        if (!bookletCode) return true;

        const { booklet } = await getValidBooklet(bookletCode);

        if (!booklet) return false;
        return true;
      },
      message:
        "Kode booklet yang dimasukkan tidak valid atau sudah tidak berlaku",
    }),
});
