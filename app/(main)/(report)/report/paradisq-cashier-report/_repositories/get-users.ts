import { db } from "@/db";

export async function getUsers(): Promise<{
  users: {
    id: bigint;
    name: string;
  }[];
}> {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return {
    users: users,
  };
}
