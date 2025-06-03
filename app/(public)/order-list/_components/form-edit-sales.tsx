"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSalesStatusCase,
  SalesStatusEnum,
} from "@/lib/enums/SalesStatusEnum";
import { SaleIncluRelationship } from "../_repositories/get-sale";

export function FormEditSales({ sale }: { sale: SaleIncluRelationship }) {
  return (
    <form>
      <div className="space-y-2">
        <Label>Status Penjualan</Label>
        <div className="flex gap-2">
          <Input
            readOnly
            className="w-[300px]"
            value={getSalesStatusCase(sale.status as SalesStatusEnum)}
          />
        </div>
      </div>
    </form>
  );
}
