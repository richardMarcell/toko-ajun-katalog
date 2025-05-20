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
import { Tenant } from "@/types/tenant";
import { Check, Edit2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TableListTenants({
  tenantsList,
  offset,
}: {
  tenantsList: Pick<
    Tenant,
    "id" | "name" | "ip_address" | "image" | "is_required_tax"
  >[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Nama</TableHead>
          <TableHead className="w-[100px]">IP Address</TableHead>
          <TableHead className="w-[100px] text-center">Dikenai Pajak</TableHead>
          <TableHead className="w-[400px]">Gambar</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenantsList.map((tenant, index) => (
          <TableRow key={tenant.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{tenant.name}</TableCell>
            <TableCell>{tenant.ip_address}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                {tenant.is_required_tax ? <Check /> : <X />}
              </div>
            </TableCell>
            <TableCell>
              <Image
                src={tenant.image}
                alt={tenant.name}
                width={40}
                height={10}
                className="rounded-lg"
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/back-office/tenants/${tenant.id}/edit`}>
                    <Edit2 />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar Tenant Qubu Resort</TableCaption>
    </Table>
  );
}
