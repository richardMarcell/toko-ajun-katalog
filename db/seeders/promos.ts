import { db } from "@/db";
import { PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { promos } from "../schema";
import { getCurrentDate } from "@/lib/utils";

export async function promoSeeder() {
  const data: (typeof promos.$inferInsert)[] = [
    {
      id: BigInt(1),
      name: "Promo Diskon 20.000",
      short_description: "Berlaku hingga akhir tahun 2025",
      code: "PROMO_NOMINAL",
      type: PromoTypeEnum.NOMINAL,
      percentage: 0,
      amount: "20000",
      is_required_booklet: true,
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setFullYear(end.getFullYear() + 1);
        return end;
      })(),
      is_active: true,
    },
    {
      id: BigInt(2),
      code: "PROMO_PERCENTAGE",
      name: "Promo diskon 20%",
      short_description:
        "Dapatkan promo diskon sebesar 20% untuk semua pembelian produk tertentu selama periode promosi berlangsung. Berlaku untuk pelanggan baru dan lama.",
      type: PromoTypeEnum.PERCENTAGE,
      percentage: 20,
      amount: "0",
      is_required_booklet: false,
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setFullYear(end.getFullYear() + 1);
        return end;
      })(),
      is_active: true,
    },
    {
      id: BigInt(3),
      code: "PROMO_SPECIAL_15",
      name: "Promo Spesial 15%",
      short_description:
        "Nikmati diskon 15% spesial untuk pembelian semua produk. Promo berlaku untuk semua kategori produk kecuali item diskon lainnya dan hanya selama bulan ini.",
      type: PromoTypeEnum.PERCENTAGE,
      percentage: 15,
      amount: "0",
      is_required_booklet: false,
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setMonth(end.getMonth() + 1);
        return end;
      })(),
      is_active: true,
    },
    {
      id: BigInt(4),
      code: "PROMO_SPECIAL_25",
      name: "Promo Spesial 25%",
      short_description:
        "Nikmati diskon 25% spesial untuk pembelian semua produk. Promo berlaku untuk semua kategori produk kecuali item diskon lainnya dan hanya selama bulan ini.",
      type: PromoTypeEnum.PERCENTAGE,
      percentage: 25,
      amount: "0",
      is_required_booklet: false,
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setMonth(end.getMonth() + 1);
        return end;
      })(),
      is_active: true,
    },
    {
      id: BigInt(5),
      code: "PROMO_SPECIAL_10",
      name: "Promo Spesial 10%",
      short_description:
        "Nikmati diskon 10% spesial untuk pembelian semua produk. Promo berlaku untuk semua kategori produk kecuali item diskon lainnya dan hanya selama bulan ini.",
      type: PromoTypeEnum.PERCENTAGE,
      percentage: 10,
      amount: "0",
      is_required_booklet: false,
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setMonth(end.getMonth() + 1);
        return end;
      })(),
      is_active: true,
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(promos).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
