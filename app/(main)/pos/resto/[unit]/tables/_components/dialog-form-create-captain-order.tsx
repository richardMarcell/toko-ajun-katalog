"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { User } from "@/types/next-auth";
import { useState } from "react";
import { FormCreateCaptainOrder } from "./form-create-captain-order";
import { TableIncludeRelationship } from "../../../_repositories/get-tables";
import { RoomIncludeRelationship } from "../../../_repositories/get-rooms";
import { useSearchParams } from "next/navigation";
import { CaptainOrderOutleEnum } from "@/lib/enums/CaptainOrderOutletEnum";

export function DialogFormCreateCaptainOrder({
  table,
  room,
  user,
}: {
  table?: TableIncludeRelationship;
  room?: RoomIncludeRelationship;
  user: User;
}) {
  const searchParams = useSearchParams();
  const outletParam = searchParams.get("outlet");
  const outlet =
    outletParam && outletParam.trim() !== ""
      ? outletParam
      : CaptainOrderOutleEnum.PATIO_BISTRO;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "cursor-pointer rounded-lg border-2 p-24 font-bold",
            isOpen ? "bg-qubu_blue text-white" : "",
          )}
          variant="outline"
        >
          {outlet === CaptainOrderOutleEnum.PATIO_BISTRO && table
            ? table.name
            : ""}
          {outlet === CaptainOrderOutleEnum.ROOM_SERVICES && room
            ? room.name
            : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[600px] lg:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Open Captain Order</DialogTitle>
        </DialogHeader>
        <FormCreateCaptainOrder room={room} table={table} user={user} />
      </DialogContent>
    </Dialog>
  );
}
