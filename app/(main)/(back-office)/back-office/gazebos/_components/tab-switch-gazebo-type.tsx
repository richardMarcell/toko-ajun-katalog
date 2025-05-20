"use client";

import { Badge } from "@/components/ui/badge";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function TabSwitchGazeboType({ gazeboType }: { gazeboType: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {Object.entries(GazeboTypeEnum).map(([key, type]) => {
        const isSelected = gazeboType == type;
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
            {getGazeboDisplayType(type)}
          </Badge>
        );
      })}
    </div>
  );
}
