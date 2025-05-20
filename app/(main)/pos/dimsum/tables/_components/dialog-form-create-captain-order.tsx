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
import { TableIncludeRelationship } from "../../_repositories/get-tables";
import { FormCreateCaptainOrder } from "./form-create-captain-order";

export function DialogFormCreateCaptainOrder({
  table,
  user,
}: {
  table: TableIncludeRelationship;
  user: User;
}) {
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
          {table.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[600px] lg:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Open Captain Order</DialogTitle>
        </DialogHeader>
        <FormCreateCaptainOrder table={table} user={user} />
      </DialogContent>
    </Dialog>
  );
}
