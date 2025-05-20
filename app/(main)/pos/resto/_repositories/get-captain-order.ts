import { db } from "@/db";
import { CaptainOrderIncludeRelationship } from "../[unit]/captain-order/[captainOrderId]/edit/_types/edit";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";

export async function getCaptainOrder(captainOrderId: string): Promise<{
  captainOrder: CaptainOrderIncludeRelationship | null;
}> {
  const captainOrder = await db.query.captainOrders.findFirst({
    with: {
      captainOrderDetails: {
        with: {
          product: true,
        },
      },
      table: true,
      room: true,
      userCreator: true,
    },
    where: (captainOrders, { eq, and }) =>
      and(
        eq(captainOrders.id, BigInt(captainOrderId)),
        eq(
          captainOrders.unit_business,
          UnitBusinessSateliteQubuEnum.RESTO_PATIO,
        ),
      ),
  });

  if (!captainOrder) {
    return {
      captainOrder: null,
    };
  }

  return {
    captainOrder: captainOrder,
  };
}
