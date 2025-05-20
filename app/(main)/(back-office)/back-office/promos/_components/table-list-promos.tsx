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
import { getPromoTypeCase, PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { Promo } from "@/types/promo";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import SwitchPromoActiveStatus from "./switch-promo-active-status";

export function TableListPromos({
  promos,
  offset,
}: {
  promos: Promo[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Nama</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead className="w-[200px]">Status Aktif</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promos.map((promo, index) => (
          <TableRow key={promo.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{promo.name}</TableCell>
            <TableCell>
              <p className="line-clamp-2">{promo.short_description}</p>
            </TableCell>
            <TableCell>
              {getPromoTypeCase(promo.type as PromoTypeEnum)}
            </TableCell>
            <TableCell>
              <SwitchPromoActiveStatus promo={promo} />
            </TableCell>

            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/back-office/promos/${promo.id}/edit`}>
                    <Edit2 />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar Promo Qubu Resort</TableCaption>
    </Table>
  );
}
