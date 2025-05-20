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
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { IpLocationIncludeRelationship } from "../_repositories/get-ip-location";
import ButtonResetOp from "./button-reset-op";

export function TableListIpLocations({
  ipLocations,
  offset,
}: {
  ipLocations: IpLocationIncludeRelationship[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">IP</TableHead>
          <TableHead>Lokasi</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Reset OP</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ipLocations.map((ipLocation, index) => {
          const currentUserLoggedIn = ipLocation.currentLoggedInUser
            ? ipLocation.currentLoggedInUser.name
            : "-";
          return (
            <TableRow key={ipLocation.id}>
              <TableCell>{offset + index + 1}</TableCell>
              <TableCell>{ipLocation.ip_address}</TableCell>
              <TableCell>{ipLocation.location_desc}</TableCell>
              <TableCell>{currentUserLoggedIn}</TableCell>
              <TableCell>
                {ipLocation.currentLoggedInUser ? (
                  <ButtonResetOp ipLocation={ipLocation} />
                ) : (
                  <></>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <Button
                    variant="transparent"
                    className="m-0 p-0 text-green-600"
                    asChild
                  >
                    <Link
                      href={`/back-office/ip-locations/${ipLocation.id}/edit`}
                    >
                      <Edit2 />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableCaption>Daftar Lokasi IP Perangkat Operator</TableCaption>
    </Table>
  );
}
