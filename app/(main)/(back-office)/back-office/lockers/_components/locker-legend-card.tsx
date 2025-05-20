import { Label } from "@/components/ui/label";
import {
  getLockerDisplayStatus,
  LockerStatusEnum,
} from "@/lib/enums/LockerStatusEnum";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import { cn } from "@/lib/utils";

const LockerStyleMap = new Map([
  [LockerStatusEnum.AVAILABLE, "bg-qubu_checker_light_green"],
  [LockerStatusEnum.IN_USE, "bg-qubu_blue"],
  [LockerStatusEnum.UNAVAILABLE, "bg-qubu_red"],
]);

export function LockerLegendCard({
  type,
  totalLocker,
}: {
  type: string;
  totalLocker: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">
          {getLockerDisplayType(type as LockerTypeEnum)}
        </h2>
        <p className="text-sm font-medium">
          Total Loker Tersedia: {totalLocker}
        </p>
      </div>

      <div className="flex gap-4">
        {Object.values(LockerStatusEnum).map((status) => {
          const lockerBgColor = LockerStyleMap.get(status) ?? "";
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded-sm", lockerBgColor)}></div>
              <Label>{getLockerDisplayStatus(status)}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
