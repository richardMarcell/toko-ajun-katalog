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
import { WristbandStatusEnum } from "@/lib/enums/WristbandStatusEnum";
import { Wristband } from "@/types/wristband";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import BadgeStatusWristband from "./badge-status-wristband";

export function TableListWristbands({
  wristbands,
  offset,
}: {
  wristbands: Wristband[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Kode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wristbands.map((wristband, index) => (
          <TableRow key={wristband.code}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{wristband.code}</TableCell>
            <TableCell>
              <BadgeStatusWristband
                status={wristband.status as WristbandStatusEnum}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/back-office/wristbands/${wristband.code}/edit`}>
                    <Edit2 />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar Gelang Qubu Resort</TableCaption>
    </Table>
  );
}
