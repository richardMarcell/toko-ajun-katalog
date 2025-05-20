import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";
import Link from "next/link";
import { CaptainOrderIncludeRelationship } from "../_types/edit";
import { AlertDialogCloseCaptainOrder } from "./alert-dialog-close-captain-order";
import { DialogFormOrderSpecialItem } from "./dialog-form-order-special-item";
import { DialogSelectPromo } from "./dialog-select-promo";
import React from "react";
import { Promo } from "@/types/promo";

export function CaptainOrderActionButton({
  captainOrder,
  promos,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
  promos: Promo[];
}) {
  const BASE_URL = `/pos/dimsum/captain-order/${captainOrder.id}`;

  return (
    <div className="flex gap-2">
      <DialogFormOrderSpecialItem captainOrder={captainOrder} />
      <DialogSelectPromo captainOrder={captainOrder} promos={promos} />
      <AlertDialogCloseCaptainOrder captainOrder={captainOrder} />

      <ButtonLinkPrint
        href={`${BASE_URL}/table-check`}
        label="Print Table Check"
        captainOrder={captainOrder}
      />
      <ButtonLinkPrint
        href={`${BASE_URL}/kitchen`}
        label="Print Dapur"
        captainOrder={captainOrder}
      />
      <ButtonLinkPrint
        href={`${BASE_URL}/bill`}
        label="Print Captain Order"
        captainOrder={captainOrder}
      />
    </div>
  );
}

function ButtonLinkPrint({
  href,
  label,
  captainOrder,
}: {
  href: string;
  label: string;
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const isClosed = captainOrder.is_closed;
  const haveOrders = captainOrder.captainOrderDetails.length > 0;
  const isDisabled = isClosed || !haveOrders;

  return (
    <Button variant={"secondary"} asChild>
      <Link
        href={href}
        className={cn(
          "flex gap-2 border",
          isDisabled ? "pointer-events-none" : "",
        )}
      >
        <Printer />
        {label}
      </Link>
    </Button>
  );
}
