import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formaterDate, formatNumberToCurrency } from "@/lib/utils";
import { SaleWithRelationsMapped } from "@/types/domains/pos/food-corner/sales/list";
import { BookmarkCheck, ChevronDown, NotepadText } from "lucide-react";
import Link from "next/link";

export default function CardSales({ sale }: { sale: SaleWithRelationsMapped }) {
  return (
    <Card className="p-4">
      <CardContent className="space-y-4 p-4">
        <div className="flex justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <NotepadText />
            <span>{sale.code}</span>
          </div>

          <div className="flex w-24 items-center gap-1 rounded-lg border-2 border-qubu_blue bg-qubu_light_blue p-1 text-sm font-semibold text-qubu_blue">
            <BookmarkCheck />
            <span>{sale.sales_status}</span>
          </div>
        </div>

        <div className="space-y-4 border-b pb-4">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 font-semibold text-qubu_blue">
                {sale.table_number ?? "-"}
              </div>
            </div>
            <div className="text-lg font-bold">{sale.order_type}</div>
          </div>
          <div className="flex justify-between text-sm text-qubu_dark_gray">
            <span>{formaterDate(sale.created_at, "date")}</span>
            <span>{formaterDate(sale.created_at, "time")}</span>
          </div>
        </div>

        <div className="flex h-[270px] flex-col">
          <Table className="flex-grow border-b">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="px-0">Items</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.sales_details.slice(0, 3).map((detail, index) => (
                <TableRow key={index} className="border-none">
                  <TableCell className="px-0">{detail.product_name}</TableCell>
                  <TableCell className="text-center">{detail.qty}</TableCell>
                  <TableCell className="text-right">
                    {formatNumberToCurrency(Number(detail.subtotal))}
                  </TableCell>
                </TableRow>
              ))}

              {sale.sales_details.length > 3 && (
                <TableRow className="border-none">
                  <TableCell colSpan={3} className="px-0 text-qubu_blue">
                    <Link
                      href={`/pos/food-corner/sales/${sale.id}`}
                      className="flex w-full items-center justify-center"
                    >
                      <span>See Detail</span>
                      <ChevronDown size={20} />
                    </Link>
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="border-none">
                <TableCell colSpan={2} className="px-0">
                  Diskon
                </TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(sale.discount_amount))}
                </TableCell>
              </TableRow>
              <TableRow className="border-none">
                <TableCell colSpan={2} className="px-0">
                  Tax
                </TableCell>
                <TableCell className="text-right">
                  {formatNumberToCurrency(Number(sale.tax_amount))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatNumberToCurrency(Number(sale.grand_total))}</span>
        </div>

        <Button
          className="w-full text-qubu_dark_gray hover:text-qubu_dark_gray"
          variant={"outline"}
          asChild
        >
          <Link href={`/pos/food-corner/sales/${sale.id}`}>See Detail</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
