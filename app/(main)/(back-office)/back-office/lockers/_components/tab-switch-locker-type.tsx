"use client";

import { Badge } from "@/components/ui/badge";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function TabSwitchLockerType({ lockerType }: { lockerType: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {Object.entries(LockerTypeEnum).map(([key, type]) => {
        const isSelected = lockerType == type;
        return (
          <Badge
            key={key}
            variant={"outline"}
            className={cn(
              "cursor-pointer rounded-xl border-[2px] border-qubu_gray p-2 text-qubu_dark_gray",
              isSelected ? "border-blue-400 text-qubu_blue" : "",
            )}
            onClick={() => router.push(`?type=${type}`)}
          >
            {getLockerDisplayType(type)}
          </Badge>
        );
      })}
    </div>
  );
}
