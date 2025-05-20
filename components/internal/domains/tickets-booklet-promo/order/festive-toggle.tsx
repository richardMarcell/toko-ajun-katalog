"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTicketOrderContext } from "@/contexts/ticket-booklet-promo-order-context";
import { getDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

export function FestiveToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFestiveQueryParamsExists = searchParams.get("festive") == "true";
  const {
    ticketSalesTemporaryInput,
    setTicketSalesTemporaryInput,
    initialTicketSalesTemporary,
  } = useTicketOrderContext();

  const today = new Date();
  const day = getDay(today);

  const isWeekend = day === 0 || day === 6;

  const onCheckboxChange = (isFestive: boolean) => {
    setTicketSalesTemporaryInput({
      ...initialTicketSalesTemporary,
      is_festive: isFestive,
    });

    const queryParams = new URLSearchParams(searchParams.toString());
    if (isFestive) queryParams.set("festive", "true");
    else queryParams.delete("festive");

    router.push(`?${queryParams.toString()}`);
  };
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        disabled={isWeekend}
        id="is_festive"
        defaultChecked={
          ticketSalesTemporaryInput.is_festive ||
          isWeekend ||
          isFestiveQueryParamsExists
        }
        onCheckedChange={(isFestive: boolean) => onCheckboxChange(isFestive)}
      />
      <Label htmlFor="is_festive">Festive</Label>
    </div>
  );
}
