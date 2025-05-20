"use client";

import { updateReturnStatus } from "@/app/(main)/swimsuit-rent/return/[salesId]/_actions/update-return-status";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSwimsuitRentReturnStatusCase,
  SwimsuitRentReturnStatusEnum,
} from "@/lib/enums/SwimsuitRentReturnStatusEnum";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { SaleIncludeRelations } from "@/types/domains/swimsuit-rent/return/show";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export function TableListSaleDetail({ sale }: { sale: SaleIncludeRelations }) {
  const [state, formAction] = useActionState(updateReturnStatus, initialValue);

  const handleButtonReturnItemOnClick = (saleDetailId: bigint) => {
    startTransition(() => formAction(saleDetailId));
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }
  }, [state]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Kode Barang</TableHead>
          <TableHead>Harga Sewa</TableHead>
          <TableHead>Harga Denda</TableHead>
          <TableHead>Item Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sale.salesDetails.map((detail, index) => {
          const isItemReturned =
            detail?.swimsuitRentWallet?.return_status ===
            SwimsuitRentReturnStatusEnum.HAS_RETURNED;
          return (
            <TableRow key={detail.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{detail.product.name}</TableCell>
              <TableCell>{detail.qty}</TableCell>
              <TableCell>{detail.product.code}</TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(detail.price))}
              </TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(detail.product.ssr_penalty))}
              </TableCell>
              <TableCell>
                {!isItemReturned ? (
                  <span className="italic text-qubu_red">
                    {getSwimsuitRentReturnStatusCase(
                      SwimsuitRentReturnStatusEnum.NOT_RETURNED,
                    )}
                  </span>
                ) : (
                  <span className="italic text-qubu_green">
                    {getSwimsuitRentReturnStatusCase(
                      SwimsuitRentReturnStatusEnum.HAS_RETURNED,
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <Button
                  onClick={() => handleButtonReturnItemOnClick(detail.id)}
                  disabled={isItemReturned}
                >
                  Return Item
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
