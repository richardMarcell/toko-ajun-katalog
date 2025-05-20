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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@/types/role";
import { Edit2 } from "lucide-react";
import Link from "next/link";

export function TableListRoles({
  rolesList,
  offset,
}: {
  rolesList: Role[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Deskripsi</TableHead>
          <TableHead className="w-[320px]">Nama</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rolesList.map((role, index) => (
          <TableRow key={role.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{role.description}</TableCell>
            <TableCell>{role.name}</TableCell>
            <TableCell>
              <div className="flex gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="transparent"
                        className="m-0 p-0 text-green-600"
                        asChild
                      >
                        <Link href={`/back-office/roles/${role.id}/edit`}>
                          <Edit2 />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Edit</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar role aplikasi Qubu Satellite</TableCaption>
    </Table>
  );
}
