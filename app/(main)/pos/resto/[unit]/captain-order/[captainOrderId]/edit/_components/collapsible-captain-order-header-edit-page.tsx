"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaptainOrderIncludeRelationship } from "../_types/edit";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  getCaptainOrderOutletCase,
  CaptainOrderOutleEnum,
} from "@/lib/enums/CaptainOrderOutletEnum";
import {
  getCaptainOrderComplimentCase,
  CaptainOrderComplimentEnum,
} from "@/lib/enums/CaptainOrderComplimentEnum";

export function CollapsibleCaptainOrderHeaderEditPage({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-2xl font-bold">
        <span>Captain Order</span>
        {isOpen ? <ChevronUp size={30} /> : <ChevronDown size={30} />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 grid w-full grid-cols-2 rounded-md border bg-white p-4">
          <Table>
            <TableBody>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">
                  Tipe Compliment
                </TableCell>
                <TableCell className="w-4">:</TableCell>
                <TableCell>
                  {getCaptainOrderComplimentCase(
                    captainOrder.compliment as CaptainOrderComplimentEnum,
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">
                  Captain Order ID
                </TableCell>
                <TableCell className="w-4">:</TableCell>
                <TableCell>{captainOrder.code}</TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">Outlet</TableCell>
                <TableCell className="w-4">:</TableCell>
                <TableCell>
                  {getCaptainOrderOutletCase(
                    captainOrder.outlet as CaptainOrderOutleEnum,
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">
                  No. Meja / No. Kamar
                </TableCell>
                <TableCell className="w-4">:</TableCell>
                {captainOrder.outlet === CaptainOrderOutleEnum.PATIO_BISTRO &&
                  captainOrder.table && (
                    <TableCell>{captainOrder.table.name}</TableCell>
                  )}
                {captainOrder.outlet === CaptainOrderOutleEnum.ROOM_SERVICES &&
                  captainOrder.room && (
                    <TableCell>{captainOrder.room.name}</TableCell>
                  )}
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">Adult/Child</TableCell>
                <TableCell className="w-4">:</TableCell>
                <TableCell>
                  {captainOrder.customer_adult_count}/
                  {captainOrder.customer_child_count}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell className="w-52 font-bold">Waitress</TableCell>
                <TableCell className="w-4">:</TableCell>
                <TableCell>{captainOrder.userCreator.name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
