import { db } from "@/db";
import { captainOrders } from "@/db/schema";
import { CaptainOrder } from "@/types/captain-order";
import { Room } from "@/types/room";
import { desc } from "drizzle-orm";

export type RoomIncludeRelationship = Room & {
  captainOrders: CaptainOrder[];
};

export async function getRooms(): Promise<{
  rooms: RoomIncludeRelationship[];
}> {
  const rooms = await db.query.rooms.findMany({
    with: {
      captainOrders: {
        orderBy: desc(captainOrders.created_at),
        limit: 1,
      },
    },
  });

  return {
    rooms: rooms,
  };
}
