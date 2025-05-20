import {
  getOrderStatusDisplay,
  OrderStatusEnum,
} from "@/lib/enums/OrderStatusEnum";
import { cn } from "@/lib/utils";

const statusPesnanStyleMap = new Map([
  [
    OrderStatusEnum.PREPARING,
    "bg-qubu_light_yellow border-qubu_yellow text-qubu_yellow",
  ],
  [
    OrderStatusEnum.SERVE,
    "bg-qubu_light_green border-qubu_green text-qubu_green",
  ],
]);

export function BadgeOrderStatus({
  orderStatus,
}: {
  orderStatus: OrderStatusEnum;
}) {
  const orderStatusLabel = getOrderStatusDisplay(orderStatus);
  const className = statusPesnanStyleMap.get(orderStatus);

  return (
    <div
      className={cn(
        "w-24 rounded-lg border p-1 text-center font-medium",
        className,
      )}
    >
      {orderStatusLabel}
    </div>
  );
}
