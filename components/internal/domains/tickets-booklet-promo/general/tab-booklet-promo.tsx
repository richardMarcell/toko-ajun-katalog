"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Promo } from "@/types/promo";
import { useRouter, useSearchParams } from "next/navigation";

export function TabBookletPromo({ promos }: { promos: Promo[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabOnClick = (promo: Promo) => {
    if (promo.is_required_booklet) {
      router.push(`/tickets-booklet-promo?promoCode=${promo.code}`);
    } else {
      router.push(`/tickets-booklet-promo/order?promoCode=${promo.code}`);
    }
  };

  return (
    <div className="w-1/5">
      <h1 className="text-2xl">Promo & Booklet</h1>
      <ScrollArea className="h-[calc(100vh-155px)]">
        <div className="flex flex-col gap-4 pt-4">
          {promos.map((promo) => {
            const isActive = searchParams.get("promoCode") == promo.code;
            return (
              <PromoBookletTabItem
                isActive={isActive}
                promo={promo}
                onClick={() => handleTabOnClick(promo)}
                key={promo.id}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function PromoBookletTabItem({
  promo,
  isActive,
  ...props
}: { promo: Promo; isActive: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      role="button"
      className={cn(
        "cursor-pointer rounded-2xl border bg-white p-4",
        isActive
          ? "bg-qubu_blue text-white"
          : promo.is_required_booklet
            ? "bg-qubu_light_blue"
            : !promo.is_required_booklet
              ? "bg-qubu_light_yellow"
              : "",
      )}
    >
      <h2 className="line-clamp-1 font-bold">{promo.name}</h2>
      <p
        className={cn(
          "line-clamp-1 text-sm text-qubu_dark_gray",
          isActive ? "text-white" : "",
        )}
      >
        {promo.short_description}
      </p>
    </div>
  );
}
