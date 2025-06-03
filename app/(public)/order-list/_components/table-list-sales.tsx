import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSalesStatusCase,
  SalesStatusEnum,
} from "@/lib/enums/SalesStatusEnum";
import { formatNumberToCurrency } from "@/lib/utils";
import { View } from "lucide-react";
import Link from "next/link";
import { SaleIncluRelationship } from "../_repositories/get-sale";

export function TableListSales({
  sales,
  offset,
}: {
  sales: SaleIncluRelationship[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Kode</TableHead>
          <TableHead className="w-[320px]">Nama</TableHead>
          <TableHead className="w-[320px]">Total Penjualan</TableHead>
          <TableHead className="w-[320px]">Status</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale, index) => (
          <TableRow key={sale.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{sale.code}</TableCell>
            <TableCell>{sale.user.name}</TableCell>
            <TableCell>
              {formatNumberToCurrency(Number(sale.grand_total))}
            </TableCell>
            <TableCell>
              {getSalesStatusCase(sale.status as SalesStatusEnum)}
            </TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/order-list/${sale.id}`}>
                    <View />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar Penjualan Toko Ajun</TableCaption>
    </Table>
  );
}
