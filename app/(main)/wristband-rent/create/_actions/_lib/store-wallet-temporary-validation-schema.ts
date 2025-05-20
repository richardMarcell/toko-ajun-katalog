import { db } from "@/db";
import { wristbands } from "@/db/schema";
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { formatNumberToCurrency } from "@/lib/utils";
import { getTopUpProduct } from "@/repositories/domain/general/get-top-up-product";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeWalletTemporaryValidationSchema = yup.object({
  quantity: yup
    .number()
    .typeError("Jumlah wajib diisi dengan angka yang valid")
    .required("Jumlah wajib diisi"),
  saldo: yup
    .number()
    .typeError("Saldo wajib diisi dengan angka yang valid")
    .test({
      name: "is-saldo-valid",
      skipAbsent: true,
      async test(saldo) {
        if (!saldo || saldo < 1) return true;

        const { topUpProduct } = await getTopUpProduct();
        if (!topUpProduct) return true;

        if (saldo < Number(topUpProduct.price)) {
          return this.createError({
            message: `Minimum pengisian saldo adalah ${formatNumberToCurrency(Number(topUpProduct.price))}`,
          });
        }

        if (saldo % 10000 !== 0) {
          return this.createError({
            message: "Mohon masukkan saldo dalam kelipatan Rp10.000.",
          });
        }

        return true;
      },
    }),
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
    .of(
      yup
        .string()
        .test(
          "is-wristband-available",
          "CashQ belum dikembalikan, silakan melakukan pengembalian CashQ",
          async function (code) {
            const wristband = await db.query.wristbands.findFirst({
              where: eq(wristbands.code, code as string),
            });

            if (!wristband) return false;
            if (wristband.status === WristbandStatusEnum.IN_USE) return false;

            return true;
          },
        )
        .test({
          name: "is-wristband-available",
          skipAbsent: true,
          async test(code) {
            const wristband = await db.query.wristbands.findFirst({
              where: eq(wristbands.code, code as string),
            });

            if (!wristband) return false;
            if (wristband.status === WristbandStatusEnum.IN_USE)  
            return this.createError({
              message: "CashQ belum dikembalikan, silakan melakukan pengembalian CashQ",
            });;

            if (wristband.status === WristbandStatusEnum.LOST_DAMAGED) {
              return this.createError({
                message: "CashQ tidak dapat digunakan karena dalam kondisi rusak",
              });
            }

            return true;
          },
        })
        .required("CashQ code wajib diisi"),
    )
    .min(1, "Wajib mengisi setidaknya 1 CashQ code")
    .required("Detail penjualan wajib diisi"),
});
