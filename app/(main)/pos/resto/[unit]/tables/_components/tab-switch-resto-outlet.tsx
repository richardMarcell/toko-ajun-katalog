"use client";

import { Badge } from "@/components/ui/badge";
import {
  getCaptainOrderOutletCase,
  getRestoPatioOutlet,
} from "@/lib/enums/CaptainOrderOutletEnum";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function TabSwitchRestoOutlet({ outletType }: { outletType: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-2 pt-4">
      {getRestoPatioOutlet().map((outlet) => {
        const isSelected = outletType == outlet;
        return (
          <Badge
            key={outlet}
            variant={"outline"}
            className={cn(
              "cursor-pointer rounded-xl border-[3px] border-qubu_gray p-2 text-qubu_dark_gray",
              isSelected ? "border-blue-400 text-qubu_blue" : "",
            )}
            onClick={() => router.push(`?outlet=${outlet}`)}
          >
            {getCaptainOrderOutletCase(outlet)}
          </Badge>
        );
      })}
    </div>
  );
}
