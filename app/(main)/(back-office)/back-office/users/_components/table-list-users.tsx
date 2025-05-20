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
import { UserIncludeRelationship } from "../_repositories/get-user";
import SwitchUserActiveStatus from "./switch-user-active-status";

export function TableListUsers({
  users,
  offset,
}: {
  users: UserIncludeRelationship[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-[200px]">Status Aktif</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <SwitchUserActiveStatus user={user} />
            </TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/back-office/users/${user.id}/edit`}>
                    <Edit2 />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar pengguna aplikasi Qubu Satellite</TableCaption>
    </Table>
  );
}
