import { db } from "@/db";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { CaptainOrderIncludeRelationship } from "../captain-order/[captainOrderId]/edit/_types/edit";

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
      userCreator: true,
    },
    where: (captainOrders, { eq, and }) =>
      and(
        eq(captainOrders.id, BigInt(captainOrderId)),
        eq(captainOrders.unit_business, UnitBusinessSateliteQubuEnum.DIMSUM),
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
