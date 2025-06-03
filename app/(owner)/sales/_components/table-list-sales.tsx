"use client";

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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Edit } from "lucide-react";
import Link from "next/link";
import { SaleIncluRelationship } from "../_repositories/get-sale";

export function TableListSales({ sales }: { sales: SaleIncluRelationship[] }) {
  const handlePrint = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Laporan Penjualan - Toko Ajun", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Kode", "Nama", "Total Penjualan", "Status"]],
      body: sales.map((sale, index) => [
        index + 1,
        sale.code,
        sale.user.name,
        formatNumberToCurrency(Number(sale.grand_total)),
        getSalesStatusCase(sale.status as SalesStatusEnum),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [52, 152, 219], // warna biru
      },
    });

    doc.save("laporan-penjualan.pdf");
  };

  return (
    <div>
      <Button disabled={sales.length === 0} onClick={handlePrint}>
        Cetak Laporan
      </Button>
      <Table className="mt-4">
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
              <TableCell>{index + 1}</TableCell>
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
                    <Link href={`/sales/${sale.id}/edit`}>
                      <Edit />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Daftar Penjualan Toko Ajun</TableCaption>
      </Table>
    </div>
  );
}
