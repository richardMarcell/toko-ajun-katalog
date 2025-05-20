import { ProductConfig } from "@/lib/config/product-config";
import { CaptainOrderOutleEnum } from "@/lib/enums/CaptainOrderOutletEnum";
import { CaptainOrder } from "@/types/captain-order";
import { CaptainOrderDetail } from "@/types/captain-order-detail";
import { User } from "@/types/user";
import { Product } from "@/types/product";
import { SpecialItemExtras } from "@/types/special-item-extras";
import { CaptainOrderTableCheck } from "@/types/captain-order-table-check";
import { Room } from "@/types/room";
import { Table } from "@/types/table";
import { getCurrentDate } from "@/lib/utils";

type CaptainOrderDetailIncludeRelationship = CaptainOrderDetail & {
  product: Product;
};

type CaptainOrderIncludeRelationship = CaptainOrder & {
  captainOrderDetails: CaptainOrderDetailIncludeRelationship[];
  table?: Table | null;
  room?: Room | null;
  userCreator: User;
};

export default function mapCaptainOrderTableCheck({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}): CaptainOrderTableCheck {
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
    is_print_as_copy: captainOrder.table_check_print_count >= 1 ? true : false,
    table_check_details: captainOrder.captainOrderDetails.map((detail) => {
      const isSpecialItem = detail.product_id === ProductConfig.special_item.id;
      const extrasSpecialItem = detail.extras as SpecialItemExtras;

      const item = isSpecialItem ? extrasSpecialItem.name : detail.product.name;

      return {
        item: item,
        qty: detail.qty,
      };
    }),
  };
}
