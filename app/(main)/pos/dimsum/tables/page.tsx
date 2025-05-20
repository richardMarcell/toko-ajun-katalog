import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { User } from "@/types/next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import {
  getTables,
  TableIncludeRelationship,
} from "../_repositories/get-tables";
import { DialogFormCreateCaptainOrder } from "./_components/dialog-form-create-captain-order";

export default async function PickTablePage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.DIMSUM_CAPTAIN_ORDER_CREATE],
    user: user,
  });

  const { tables } = await getTables();

  return (
    <React.Fragment>
      <h1 className="text-2xl font-bold">Pilih Meja</h1>
      <p className="font-medium text-qubu_dark_gray">
        Click untuk booking meja & Open Captain Order
      </p>
      <Button className="my-4 bg-qubu_blue" asChild>
        <Link href={"/pos/dimsum/captain-order"}>List Pesanan</Link>
      </Button>

      <TableList tables={tables} user={user} />
    </React.Fragment>
  );
}

function TableList({
  tables,
  user,
}: {
  tables: TableIncludeRelationship[];
  user: User;
}) {
  return (
    <div className="flex gap-2 pt-4">
      {tables.map((table) => {
        if (table.captainOrders[0] && !table.captainOrders[0].is_closed) {
          return (
            <ButtonLinkEditCaptainOrder
              captainOrderId={table.captainOrders[0].id}
              label={table.name}
              key={table.id}
            />
          );
        } else {
          return (
            <DialogFormCreateCaptainOrder
              user={user}
              table={table}
              key={table.id}
            />
          );
        }
      })}
    </div>
  );
}

function ButtonLinkEditCaptainOrder({
  captainOrderId,
  label,
}: {
  captainOrderId: bigint;
  label: string;
}) {
  return (
    <Button
      className="cursor-pointer rounded-lg border-2 bg-qubu_blue p-24 font-bold text-white"
      variant="outline"
      asChild
    >
      <Link href={`/pos/dimsum/captain-order/${captainOrderId}/edit`}>
        {label}
      </Link>
    </Button>
  );
}
