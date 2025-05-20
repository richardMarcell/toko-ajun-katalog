import { db } from "@/db";
import * as yup from "yup";

export const storeSalesValidationSchema = yup.object({
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
  ota_redeem_code: yup
    .string()
    .max(255, "Redeem code tidak boleh lebih dari 255 karakter")
    .required("Redeem code wajib diisi"),
  vendor_type_code: yup
    .string()
    .typeError("Agen penjual wajib diisi dengan karakter yang valid")
    .required("Agen penjual wajib dipilih")
    .test({
      name: "is-vendor-type-exists",
      skipAbsent: true,
      async test(vendorTypeCode) {
        if (!vendorTypeCode) return true;

        const vendorType = await db.query.vendorTypes.findFirst({
          where: (vendorTypes, { eq }) => eq(vendorTypes.code, vendorTypeCode),
        });

        if (vendorType) return true;

        return false;
      },
      message:
        "Agen penjual yang dipilih tidak valid atau tidak terdaftar dalam sistem",
    }),
});
