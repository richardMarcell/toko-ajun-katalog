import { db } from "@/db";
import { stocks } from "../schema";
import { SateliteUnitConfig } from "@/lib/config/satelite-unit-config";

export async function stockSeeder() {
  const isHasRecord = (await db.$count(stocks)) > 0;

  if (!isHasRecord) {
    const data: (typeof stocks.$inferInsert)[] = [
      {
        product_id: BigInt(1),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(2),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(3),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(4),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(5),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(6),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(7),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(8),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(9),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(10),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(11),
        warehouse_id: SateliteUnitConfig.souvenir.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(12),
        warehouse_id: SateliteUnitConfig.souvenir.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(13),
        warehouse_id: SateliteUnitConfig.souvenir.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(22),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(14),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(15),
        warehouse_id: SateliteUnitConfig.swimming_class.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(16),
        warehouse_id: SateliteUnitConfig.swimming_class.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(11),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(12),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(13),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(14),
        warehouse_id: SateliteUnitConfig.souvenir.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(17),
        warehouse_id: SateliteUnitConfig.swimming_class.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(18),
        warehouse_id: SateliteUnitConfig.entry_pass.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(19),
        warehouse_id: SateliteUnitConfig.entry_pass.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(20),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(21),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(23),
        warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(24),
        warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(25),
        warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(28),
        warehouse_id: SateliteUnitConfig.water_park_ticket.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(29),
        warehouse_id: SateliteUnitConfig.water_park_ticket.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(30),
        warehouse_id: SateliteUnitConfig.water_park_ticket.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(37),
        warehouse_id: SateliteUnitConfig.water_park_ticket.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(38),
        warehouse_id: SateliteUnitConfig.water_park_ticket.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(32),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(35),
        warehouse_id: SateliteUnitConfig.food_corner.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(35),
        warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(36),
        warehouse_id: SateliteUnitConfig.locker.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(1),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(2),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(3),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(4),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(35),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: 10,
      },
      {
        product_id: BigInt(31),
        warehouse_id: SateliteUnitConfig.resto_patio.warehouse_id,
        qty: null,
      },
      {
        product_id: BigInt(31),
        warehouse_id: SateliteUnitConfig.dimsum.warehouse_id,
        qty: null,
      },
    ];

    await Promise.all(
      data.map((dataItem) =>
        db.insert(stocks).values(dataItem).onDuplicateKeyUpdate({
          set: dataItem,
        }),
      ),
    );
  }
}
