import { db } from "@/db";
import { promos } from "@/db/schema";
import { PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { getDateStartTime, removeDateTimezone } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as yup from "yup";

const today = removeDateTimezone(getDateStartTime());

export const storePromoValidationSchema = yup.object({
  code: yup
    .string()
    .required("Kode Promo wajib diisi")
    .typeError("Kode promo wajib diisi dengan karakter yang valid")
    .test("no-spaces", "Kode Promo tidak boleh mengandung spasi", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test(
      "is-promo-code-exists",
      "Kode Promo sudah terdaftar",
      async function (code) {
        const promo = await db.query.promos.findFirst({
          where: eq(promos.code, code),
        });

        if (promo) return false;

        return true;
      },
    ),
  name: yup
    .string()
    .required("Nama promo wajib diisi")
    .typeError("Nama promo wajib diisi dengan karakter yang valid"),
  short_description: yup
    .string()
    .required("Deskripsi singkat wajib diisi")
    .typeError("Deskripsi singkat wajib diisi dengan karakter yang valid"),
  type: yup
    .string()
    .required("Tipe promo singkat wajib dipilih")
    .typeError("Tipe promo singkat wajib diisi dengan karakter yang valid")
    .oneOf(
      Object.values(PromoTypeEnum),
      "Tipe promo yang diterima hanya Percentage dan Nominal",
    ),
  percentage: yup
    .number()
    .required("Persentase promo wajib diisi")
    .typeError("Persentase promo wajib diisi dengan karakter yang valid")
    .min(0, "Persentase promo tidak boleh kurang dari 0")
    .max(100, "Persentase promo tidak boleh lebih dari 100")
    .test("is-required", "Persentase promo wajib diisi", function (percentage) {
      const promoType = this.parent.type;

      if (promoType === PromoTypeEnum.PERCENTAGE && percentage < 1)
        return false;

      return true;
    }),
  amount: yup
    .number()
    .required("Nominal promo wajib diisi")
    .typeError("Nominal promo wajib diisi dengan karakter yang valid")
    .min(0, "Nominal promo tidak boleh kurang dari 0")
    .test("is-required", "Nominal promo wajib diisi", function (amount) {
      const promoType = this.parent.type;

      if (promoType === PromoTypeEnum.NOMINAL && amount < 1) return false;

      return true;
    }),
  is_required_booklet: yup
    .boolean()
    .required("Penyertaan booklet wajib diisi")
    .typeError("Penyertaan booklet wajib diisi dengan karakter yang valid"),
  periode_start: yup
    .date()
    .typeError("Periode awal wajib diisi dengan format yang valid")
    .min(today, "Periode awal tidak boleh kurang dari hari ini")
    .required("Periode awal wajib diisi"),
  periode_end: yup
    .date()
    .typeError("Periode akhir wajib diisi dengan format yang valid")
    .min(
      yup.ref("periode_start"),
      "Periode akhir tidak boleh kurang dari periode awal",
    )
    .required("Periode akhir wajib diisi"),
  unit_businesses: yup
    .array()
    .required("Unit bisnis wajib diisi")
    .of(
      yup
        .string()
        .required("Unit Bisnis Wajib diisi")
        .oneOf(
          Object.values(UnitBusinessSateliteQubuEnum),
          "Unit bisnis tidak terdaftar dalam sistem",
        ),
    )
    .min(1, "Wajib memilih setidaknya 1 unit bisnis"),
});
