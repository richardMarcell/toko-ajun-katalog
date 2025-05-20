import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { UserHasRole } from "@/types/user-has-role";

export type UserIncludeRelationship = User & {
  userHasRoles: UserHasRole[];
};

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
          <TableHead className="w-[200px]">Status Aktif</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell
              className={cn(
                `font-semibold ${user.is_active ? "text-blue-600" : "text-red-600"}`,
              )}
            >
              {user.is_active ? "Aktif" : "Tidak Aktif"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar pengguna aplikasi Qubu Satellite</TableCaption>
    </Table>
  );
}
