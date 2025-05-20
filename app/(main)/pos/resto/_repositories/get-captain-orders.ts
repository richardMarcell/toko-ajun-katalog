import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";
import { CaptainOrderOutleEnum } from "@/lib/enums/CaptainOrderOutletEnum";
import { SpecialItemExtras } from "@/types/special-item-extras";
import {
  CaptainOrderDetailIncludeRelationship,
  CaptainOrderIncludeRelationship,
} from "../[unit]/captain-order/[captainOrderId]/edit/_types/edit";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";

export async function getCaptainOrders() {
  const captainOrders = await db.query.captainOrders.findMany({
    with: {
      table: true,
      room: true,
      captainOrderDetails: {
        with: {
          product: true,
        },
        limit: 4,
      },
      userCreator: true,
    },
    where: (captainOrders, { eq }) =>
      eq(captainOrders.unit_business, UnitBusinessSateliteQubuEnum.RESTO_PATIO),
  });

  return {
    captainOrders: captainOrders.map(mapCaptainOrder),
  };
}

function mapCaptainOrder(captainOrder: CaptainOrderIncludeRelationship) {
  const tableOrRoomNumber =
    {
      [CaptainOrderOutleEnum.PATIO_BISTRO]: captainOrder.table?.name ?? "",
      [CaptainOrderOutleEnum.ROOM_SERVICES]: captainOrder.room?.name ?? "",
    }[captainOrder.outlet] ?? "-";

  const totalQty = captainOrder.captainOrderDetails.reduce(
    (total, detail) => total + detail.qty,
    0,
  );
  const totalPaidQty = captainOrder.captainOrderDetails.reduce(
    (total, detail) => total + detail.paid_qty,
    0,
  );

  return {
    id: captainOrder.id,
    code: captainOrder.code,
    order_number: captainOrder.order_number,
    is_closed: captainOrder.is_closed,
    customer_name: captainOrder.customer_name,
    outlet: captainOrder.outlet,
    table_or_room_number: tableOrRoomNumber,
    order_type: captainOrder.order_type,
    created_at: captainOrder.created_at,
    tax_amount: captainOrder.tax_amount,
    grand_total: captainOrder.grand_total,
    total_qty: totalQty,
    total_paid_qty: totalPaidQty,
    captain_order_details: mapCaptainOrderDetails(
      captainOrder.captainOrderDetails,
    ),
  };
}

function mapCaptainOrderDetails(
  details: CaptainOrderDetailIncludeRelationship[],
) {
  return details.map((detail) => {
    const isSpecialItem = detail.product_id === ProductConfig.special_item.id;
    const specialExtrasItem = detail.extras as SpecialItemExtras;

    return {
      product_name: isSpecialItem
        ? specialExtrasItem.name
        : detail.product.name,
      qty: detail.qty,
      subtotal: detail.subtotal,
      price: detail.price,
    };
  });
}
