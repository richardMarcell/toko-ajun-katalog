import { db } from "@/db";
import { users } from "@/db/schema";
import { User } from "@/types/user";
import { UserHasRole } from "@/types/user-has-role";
import { eq } from "drizzle-orm";

export type UserIncludeRelationship = User & {
  userHasRoles: UserHasRole[];
};

export async function getUser({
  userId,
}: {
  userId: string;
}): Promise<{ user: UserIncludeRelationship | null }> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, BigInt(userId)),
    with: {
      userHasRoles: true,
    },
  });

  if (!user)
    return {
      user: null,
    };

  return {
    user: user,
  };
}
