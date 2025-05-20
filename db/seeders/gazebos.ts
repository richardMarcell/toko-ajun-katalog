import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { GazeboTypeEnum } from "@/lib/enums/GazeboTypeEnum";
import { eq } from "drizzle-orm";
import { gazebos, products } from "../schema";

const DEFAULT_GAZEBO_FAMILY_TYPE_PRODUCT_ID = BigInt(33);
const DEFAULT_GAZEBO_VIP_TYPE_PRODUCT_ID = BigInt(34);

export async function gazeboSeeder() {
  const existing = await db.query.gazebos.findMany();

  if (existing.length > 0) {
    console.log("Gazebo seeder skipped: data already exists");
    return;
  }

  const gazeboFamilyTypeProductId = await getGazeboFamilyTypeProductId();
  const gazeboVipTypeProductId = await getGazeboVipTypeProductId();

  const gazeboList: (typeof gazebos.$inferInsert)[] = [
    {
      id: BigInt(1),
      label: "1",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(2),
      label: "2",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(3),
      label: "3",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(4),
      label: "4",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(5),
      label: "5",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(6),
      label: "6",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(7),
      label: "7",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(8),
      label: "8",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(9),
      label: "9",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(10),
      label: "10",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(11),
      label: "11",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(12),
      label: "12",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(13),
      label: "13",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(14),
      label: "14",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(15),
      label: "15",
      type: GazeboTypeEnum.FAMILY,
      status: GazeboStatusEnum.AVAILABLE,
      product_id: gazeboFamilyTypeProductId,
    },
    {
      id: BigInt(16),
      label: "1",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(17),
      label: "2",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(18),
      label: "3",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(19),
      label: "4",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(20),
      label: "5",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(21),
      label: "6",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(22),
      label: "7",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(23),
      label: "8",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(23),
      label: "9",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(25),
      label: "10",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
    {
      id: BigInt(26),
      label: "11",
      type: GazeboTypeEnum.VIP,
      product_id: gazeboVipTypeProductId,
      status: GazeboStatusEnum.AVAILABLE,
    },
  ];

  await Promise.all(
    gazeboList.map((gazebo) =>
      db.insert(gazebos).values(gazebo).onDuplicateKeyUpdate({
        set: gazebo,
      }),
    ),
  );
}

async function getGazeboFamilyTypeProductId(): Promise<bigint> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, ProductConfig.gazebo.family.id),
  });

  if (!product) return DEFAULT_GAZEBO_FAMILY_TYPE_PRODUCT_ID;

  return product.id;
}

async function getGazeboVipTypeProductId(): Promise<bigint> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, ProductConfig.gazebo.vip.id),
  });

  if (!product) return DEFAULT_GAZEBO_VIP_TYPE_PRODUCT_ID;

  return product.id;
}
