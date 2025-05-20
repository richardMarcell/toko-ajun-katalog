import { getServerSession } from "next-auth";

import { authOptions } from "../../auth-options";
import { User } from "@/types/next-auth";

export async function getUserAuthenticated(): Promise<User | null> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return null;

  return {
    ...session.user,
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.name ?? "",
  };
}

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
