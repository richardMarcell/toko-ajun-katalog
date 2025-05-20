import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import { cn } from "@/lib/utils";
import { Locker } from "@/types/locker";
import Link from "next/link";

const LockerStyleMap = new Map([
  [LockerStatusEnum.AVAILABLE, "bg-qubu_checker_light_green"],
  [LockerStatusEnum.IN_USE, "bg-qubu_blue"],
  [LockerStatusEnum.UNAVAILABLE, "bg-qubu_red"],
]);

export function LockerList({ lockers }: { lockers: Locker[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {lockers.map((locker) => {
        const lockerBgColor =
          LockerStyleMap.get(locker.status as LockerStatusEnum) ?? "";
        return (
          <Link
            key={locker.id}
            href={`/back-office/lockers/${locker.id}/edit`}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-lg border font-medium text-white",
              lockerBgColor,
            )}
          >
            {locker.label}
          </Link>
        );
      })}
    </div>
  );
}
