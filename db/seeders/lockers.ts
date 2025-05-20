import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { LockerTypeEnum } from "@/lib/enums/LockerTypeEnum";
import { eq } from "drizzle-orm";
import { lockers, products } from "../schema";

const DEFAULT_LOCKER_STANDARD_TYPE_PRODUCT_ID = BigInt(26);
const DEFAULT_LOCKER_FAMILY_TYPE_PRODUCT_ID = BigInt(27);

const wristbandCodeList = ["111", "222", "333", "444", "555"];

export async function lockerSeeder() {
  const existing = await db.query.lockers.findMany();

  if (existing.length > 0) {
    console.log("Locker seeder skipped: data already exists");
    return;
  }

  const lockerStandardTypeProductId = await getLockerStandardTypeProductId();
  const lockerFamilyTypeProductId = await getLockerFamilyTypeProductId();

  const lockerList: (typeof lockers.$inferInsert)[] = [];

  for (let i = 1; i <= 120; i++) {
    lockerList.push({
      id: BigInt(i),
      label: i.toString(),
      type: LockerTypeEnum.STANDARD,
      status: LockerStatusEnum.AVAILABLE,
      product_id: lockerStandardTypeProductId,
      wristband_code:
        wristbandCodeList[Math.floor(Math.random() * wristbandCodeList.length)],
    });
  }

  for (let i = 1; i <= 120; i++) {
    lockerList.push({
      id: BigInt(i + 120),
      label: i.toString(),
      type: LockerTypeEnum.FAMILY,
      status: LockerStatusEnum.AVAILABLE,
      product_id: lockerFamilyTypeProductId,
      wristband_code:
        wristbandCodeList[Math.floor(Math.random() * wristbandCodeList.length)],
    });
  }

  await Promise.all(
    lockerList.map((locker) =>
      db.insert(lockers).values(locker).onDuplicateKeyUpdate({
        set: locker,
      }),
    ),
  );
}

async function getLockerStandardTypeProductId(): Promise<bigint> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, ProductConfig.locker.standard.id),
  });

  if (!product) return DEFAULT_LOCKER_STANDARD_TYPE_PRODUCT_ID;

  return product.id;
}

async function getLockerFamilyTypeProductId(): Promise<bigint> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, ProductConfig.locker.family.id),
  });

  if (!product) return DEFAULT_LOCKER_FAMILY_TYPE_PRODUCT_ID;

  return product.id;
}
