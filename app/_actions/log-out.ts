"use server";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { deleteAuthCookie } from "@/lib/services/auth/delete-auth-cookie";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export default async function logOut({
  userSession,
}: {
  userSession: User | undefined;
}): Promise<void> {
  const cookieStore = await cookies();

  const jwtToken = cookieStore.get("next-auth.session-token");

  if (!jwtToken) {
    console.error("Your session token is not found in cookie.");
    return;
  }

  if (!userSession) {
    console.error("You haven't user session.");
    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, userSession.email ?? ""),
  });

  if (!user) {
    console.error("User is not found.");
    return;
  }

  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.user_id, user.id), eq(sessions.jwt, jwtToken.value)),
  });

  if (!session) {
    console.error("Your session token is not found in database.");
    return;
  }

  await db.delete(sessions).where(eq(sessions.id, session.id));
  await deleteAuthCookie();

  return;
}
