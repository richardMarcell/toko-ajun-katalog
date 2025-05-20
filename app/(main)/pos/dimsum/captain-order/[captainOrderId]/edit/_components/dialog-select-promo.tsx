"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formaterDate } from "@/lib/utils";
import { Promo } from "@/types/promo";
import { BadgePercent, Check, Percent, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CaptainOrderIncludeRelationship } from "../_types/edit";
import { toast } from "sonner";

export function DialogSelectPromo({
  captainOrder,
  promos,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
  promos: Promo[];
}) {
  const isClosed = captainOrder.is_closed;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleButtonApplyOnClick = () => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());

    if (selectedPromoCode) {
      currentSearchParams.set("promoCode", selectedPromoCode);
      router.push(`?${currentSearchParams.toString()}`);

      setIsOpen(false);
    } else {
      toast("Promo belum dipilih", {
        description:
          "Silakan pilih promo terlebih dahulu sebelum menekan tombol Apply.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!isClosed}
          className="flex gap-2 bg-qubu_blue text-white"
        >
          <Percent />
          <span>Diskon</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Promo</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {promos.map((promo) => (
              <CardPromo
                promo={promo}
                key={promo.id}
                selectedPromoCode={selectedPromoCode}
                onSelect={setSelectedPromoCode}
              />
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <X /> Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleButtonApplyOnClick} className="bg-qubu_blue">
            <Check /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CardPromo({
  promo,
  selectedPromoCode,
  onSelect,
}: {
  promo: Promo;
  selectedPromoCode: string | null;
  onSelect: (code: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(promo.code)}
      key={promo.id}
      className={cn(
        "cursor-pointer rounded-2xl border bg-white p-4",
        !promo.is_active && "pointer-events-none opacity-60",
        promo.code === selectedPromoCode && "bg-qubu_blue text-white",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent className="h-5 w-5" />
          <h3 className="text-base font-semibold">{promo.name}</h3>
        </div>
        <span className="text-sm font-bold">{promo.percentage}%</span>
      </div>
      <p className="mt-1 text-sm">{promo.short_description}</p>
      <p className="mt-4 text-right text-xs">
        Periode: {formaterDate(promo.periode_start, "date")} -{" "}
        {formaterDate(promo.periode_end, "date")}
      </p>
    </div>
  );
}
