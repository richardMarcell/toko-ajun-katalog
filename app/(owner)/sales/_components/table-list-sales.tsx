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

    // Judul laporan
    doc.setFontSize(14);
    doc.text("Laporan Penjualan - Toko Ajun", 14, 20);

    // Tanggal cetak
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${currentDate}`, 14, 26);

    // Tabel isi
    autoTable(doc, {
      startY: 32,
      head: [["#", "Kode", "Nama", "Tanggal", "Total Penjualan", "Status"]],
      body: sales.map((sale, index) => [
        index + 1,
        sale.code,
        sale.user.name,
        new Date(sale.created_at).toLocaleDateString(),
        formatNumberToCurrency(Number(sale.grand_total)),
        getSalesStatusCase(sale.status as SalesStatusEnum),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [52, 152, 219],
      },
    });

    // Hitung total keseluruhan
    const totalKeseluruhan = sales.reduce(
      (sum, sale) => sum + Number(sale.grand_total),
      0,
    );

    // Ambil posisi Y terakhir tabel
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const finalY = (doc as any).lastAutoTable.finalY;

    // Tampilkan total keseluruhan
    doc.setFontSize(12);
    doc.text(
      `Total Keseluruhan Penjualan: ${formatNumberToCurrency(totalKeseluruhan)}`,
      14,
      finalY + 10,
    );

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
            <TableHead className="w-[160px]">Kode</TableHead>
            <TableHead className="w-[160px]">Nama</TableHead>
            <TableHead className="w-[160px]">Tanggal</TableHead>
            <TableHead className="w-[160px]">Total Penjualan</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => (
            <TableRow key={sale.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{sale.code}</TableCell>
              <TableCell>{sale.user.name}</TableCell>
              <TableCell>
                {new Date(sale.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {formatNumberToCurrency(Number(sale.grand_total))}
              </TableCell>
              <TableCell>
                {getSalesStatusCase(sale.status as SalesStatusEnum)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
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
        <TableCaption>
          Daftar Penjualan Toko Ajun - Total Data: {sales.length}
        </TableCaption>
      </Table>
    </div>
  );
}
