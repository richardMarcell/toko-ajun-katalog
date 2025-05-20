import { db } from "@/db";
import { users } from "@/db/schema";
import { User } from "@/types/user";
import { eq } from "drizzle-orm";

export async function getUser({
  userId,
}: {
  userId: string;
}): Promise<{ user: User | null }> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, BigInt(userId)),
  });

  if (!user)
    return {
      user: null,
    };

  return {
    user: user,
  };
}
