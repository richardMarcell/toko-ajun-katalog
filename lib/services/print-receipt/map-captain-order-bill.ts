import { ProductConfig } from "@/lib/config/product-config";
import { CaptainOrderOutleEnum } from "@/lib/enums/CaptainOrderOutletEnum";
import { getCurrentDate } from "@/lib/utils";
import { CaptainOrder } from "@/types/captain-order";
import { CaptainOrderBill } from "@/types/captain-order-bill";
import { CaptainOrderDetail } from "@/types/captain-order-detail";
import { Product } from "@/types/product";
import { Room } from "@/types/room";
import { SpecialItemExtras } from "@/types/special-item-extras";
import { Table } from "@/types/table";
import { User } from "@/types/user";

type CaptainOrderDetailIncludeRelationship = CaptainOrderDetail & {
  product: Product;
};

type CaptainOrderIncludeRelationship = CaptainOrder & {
  captainOrderDetails: CaptainOrderDetailIncludeRelationship[];
  table?: Table | null;
  room?: Room | null;
  userCreator: User;
};

export default function mapCaptainOrderBill({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}): CaptainOrderBill {
  const tableOrRoomNumber =
    {
      [CaptainOrderOutleEnum.PATIO_BISTRO]: captainOrder.table?.name ?? "",
      [CaptainOrderOutleEnum.DIMSUM]: captainOrder.table?.name ?? "",
      [CaptainOrderOutleEnum.ROOM_SERVICES]: captainOrder.room?.name ?? "",
    }[captainOrder.outlet] ?? "-";

  return {
    id: Number(captainOrder.id),
    code: captainOrder.code,
    op: captainOrder.userCreator.name,
    table_or_room_number: tableOrRoomNumber,
    customer_name: captainOrder.customer_name,
    date: getCurrentDate(),
    customer_adult_count: captainOrder.customer_adult_count,
    customer_child_count: captainOrder.customer_child_count,
    total_qty: captainOrder.captainOrderDetails.reduce(
      (total, detail) => total + detail.qty,
      0,
    ),
    discount_amount: Number(captainOrder.discount_amount),
    total_gross: Number(captainOrder.total_gross),
    total_net: Number(captainOrder.total_net),
    grand_total: Number(captainOrder.grand_total),
    is_print_as_copy: captainOrder.bill_print_count >= 1 ? true : false,
    captain_order_bill_details: captainOrder.captainOrderDetails.map(
      (detail) => {
        const isSpecialItem =
          detail.product_id === ProductConfig.special_item.id;
        const extrasSpecialItem = detail.extras as SpecialItemExtras;

        const item = isSpecialItem
          ? extrasSpecialItem.name
          : detail.product.name;

        return {
          item: item,
          qty: detail.qty,
          subtotal: Number(detail.subtotal),
        };
      },
    ),
  };
}
