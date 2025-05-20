import { ProductConfig } from "@/lib/config/product-config";
import {
  getCaptainOrderOutletCase,
  CaptainOrderOutleEnum,
} from "@/lib/enums/CaptainOrderOutletEnum";
import { CaptainOrder } from "@/types/captain-order";
import { CaptainOrderDetail } from "@/types/captain-order-detail";
import { User } from "@/types/user";
import { Product } from "@/types/product";
import { CaptainOrderKitchen } from "@/types/captain-order-kitchen";
import { SpecialItemExtras } from "@/types/special-item-extras";
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

export default function mapCaptainOrderKitchen({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}): CaptainOrderKitchen {
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
    outlet: getCaptainOrderOutletCase(
      captainOrder.outlet as CaptainOrderOutleEnum,
    ),
    table_or_room_number: tableOrRoomNumber,
    customer_name: captainOrder.customer_name,
    date: getCurrentDate(),
    is_print_as_copy: captainOrder.kitchen_print_count >= 1 ? true : false,
    kitchen_details: captainOrder.captainOrderDetails.map((detail) => {
      const isSpecialItem = detail.product_id === ProductConfig.special_item.id;
      const extrasSpecialItem = detail.extras as SpecialItemExtras;

      let item = isSpecialItem ? extrasSpecialItem.name : detail.product.name;
      item = detail.note ? item + ` (${detail.note})` : item;
      return {
        item: item,
        qty: detail.qty,
      };
    }),
  };
}
