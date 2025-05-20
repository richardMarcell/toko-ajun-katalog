import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { CaptainOrderOutleEnum } from "@/lib/enums/CaptainOrderOutletEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { User } from "@/types/next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import isAllowedRestoUnit from "../../_libs/authorize-resto-unit";
import {
  getRooms,
  RoomIncludeRelationship,
} from "../../_repositories/get-rooms";
import {
  getTables,
  TableIncludeRelationship,
} from "../../_repositories/get-tables";
import { DialogFormCreateCaptainOrder } from "./_components/dialog-form-create-captain-order";
import { TabSwitchRestoOutlet } from "./_components/tab-switch-resto-outlet";

export default async function PickTablePage({
  params,
  searchParams,
}: {
  params: Promise<{
    unit: string;
  }>;
  searchParams: Promise<{
    outlet: string;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_CREATE],
    user: user,
  });
  const { unit } = await params;
  const { outlet } = await searchParams;
  const outletType = outlet ? outlet : CaptainOrderOutleEnum.PATIO_BISTRO;

  const authorizedRestoUnit = isAllowedRestoUnit(unit);

  if (!authorizedRestoUnit) return notFound();

  const { tables } = await getTables();
  const { rooms } = await getRooms();

  return (
    <React.Fragment>
      <HeaderPage outletType={outletType} />
      <Button className="my-4 bg-qubu_blue" asChild>
        <Link href={"/pos/resto/patio/captain-order"}>List Pesanan</Link>
      </Button>

      <TabSwitchRestoOutlet outletType={outletType} />

      {outletType === CaptainOrderOutleEnum.PATIO_BISTRO && (
        <TableList tables={tables} user={user} />
      )}

      {outletType === CaptainOrderOutleEnum.ROOM_SERVICES && (
        <RoomList rooms={rooms} user={user} />
      )}
    </React.Fragment>
  );
}

function HeaderPage({ outletType }: { outletType: string }) {
  if (outletType === CaptainOrderOutleEnum.PATIO_BISTRO) {
    return (
      <>
        <h1 className="text-2xl font-bold">Pilih Meja</h1>
        <p className="font-medium text-qubu_dark_gray">
          Click untuk booking meja & Open Captain Order
        </p>
      </>
    );
  }

  if (outletType === CaptainOrderOutleEnum.ROOM_SERVICES) {
    return (
      <>
        <h1 className="text-2xl font-bold">Pilih Kamar</h1>
        <p className="font-medium text-qubu_dark_gray">
          Click untuk Open Captain Order
        </p>
      </>
    );
  }
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

function RoomList({
  rooms,
  user,
}: {
  rooms: RoomIncludeRelationship[];
  user: User;
}) {
  return (
    <div className="flex gap-2 pt-4">
      {rooms.map((room) => {
        if (room.captainOrders[0] && !room.captainOrders[0].is_closed) {
          return (
            <ButtonLinkEditCaptainOrder
              captainOrderId={room.captainOrders[0].id}
              label={room.name}
              key={room.id}
            />
          );
        } else {
          return (
            <DialogFormCreateCaptainOrder
              user={user}
              room={room}
              key={room.id}
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
      <Link href={`/pos/resto/patio/captain-order/${captainOrderId}/edit`}>
        {label}
      </Link>
    </Button>
  );
}
