import { Badge } from "@/components/ui/badge";
import {
  getWristbandStatusCase,
  WristbandStatusEnum,
} from "@/lib/enums/WristbandStatusEnum";

const wristbandStatusStyleMap = new Map([
  [WristbandStatusEnum.AVAILABLE, "bg-qubu_green"],
  [WristbandStatusEnum.IN_USE, "bg-qubu_yellow"],
  [WristbandStatusEnum.LOST_DAMAGED, "bg-qubu_red"],
]);

export default function BadgeStatusWristband({
  status,
}: {
  status: WristbandStatusEnum;
}) {
  const wristbandStatusShow = getWristbandStatusCase(status);

  const color = wristbandStatusStyleMap.get(status) ?? "bg-qubu_green";

  return (
    <Badge className={`border-transparent ${color} shadow hover:${color}/80 cursor-default`}>
      {wristbandStatusShow}
    </Badge>
  );
}
