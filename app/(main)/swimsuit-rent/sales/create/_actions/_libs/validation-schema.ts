import { db } from "@/db";
import { WalletStatusEnum } from "@/lib/enums/WalletStatusEnum";
import { WalletWristbandStatusEnum } from "@/lib/enums/WalletWristbandStatusEnum";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import * as yup from "yup";

export const validationSchema = yup.object({
  customer_name: yup
    .string()
    .typeError("Nama penyewa wajib diisi dengan angka yang valid")
    .required("Nama penyewa wajib diisi"),
  customer_phone_number: yup
    .string()
    .typeError("Nomor Hp wajib diisi dengan angka yang valid")
    .required("Nomor Hp wajib diisi"),
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

              const product = await db.query.products.findFirst({
                where: (products, { eq }) => eq(products.id, BigInt(id)),
                with: {
                  stockSwimsuitRent: true,
                },
              });

              if (!product || !product.stockSwimsuitRent) {
                return this.createError({
                  message: `Produk tidak ditemukan.`,
                });
              }

              const selectedProductQty = this.parent.qty;
              const availableStock = Number(product.stockSwimsuitRent.qty);

              if (availableStock < selectedProductQty) {
                return this.createError({
                  message: `Stok untuk produk ${product.name} tidak mencukupi.`,
                });
              }

              return true;
            },
          }),
        product_code: yup
          .string()
          .typeError("Kode produk diisi dengan karakter yang valid")
          .required("Kode produk wajib diisi"),
        product_description: yup
          .string()
          .typeError("Deskripsi produk diisi dengan karakter yang valid")
          .required("Deskripsi produk wajib diisi"),
        product_name: yup
          .string()
          .typeError("Nama produk diisi dengan karakter yang valid")
          .required("Nama produk wajib diisi"),
        product_image: yup
          .string()
          .typeError("Gambar produk diisi dengan karakter yang valid")
          .required("Gambar produk wajib diisi"),
        product_stock_qty: yup
          .number()
          .typeError(
            "Kuantitas stock produk wajib diisi dengan angka yang valid",
          )
          .required("Kuantitas stock produk wajib diisi"),
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
  wristband_code: yup
    .string()
    .typeError("Kode CashQ wajib diisi dengan angka yang valid")
    .required("Kode CashQ wajib diisi")
    .test({
      name: "is-wristband-code-exist",
      skipAbsent: true,
      async test(code) {
        if (!code) return true;

        const wristband = await db.query.wristbands.findFirst({
          where: (wristbands, { eq, and }) =>
            and(
              eq(wristbands.code, code),
              eq(wristbands.status, WristbandStatusEnum.IN_USE),
            ),
        });

        if (!wristband) return false;
        return true;
      },
      message: "Kode CashQ yang dimasukkan tidak valid atau tidak ditemukan",
    })
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
});
