import { db } from "@/db";
import { sessions } from "@/db/schema";
import { getCurrentDate } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const USER_ONLY_HAVE_A_SESSION = true;

export async function GET(request: NextRequest) {
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({
    req: request,
    secret: nextAuthSecret,
    raw: true,
  });

  const user = await getToken({
    req: request,
    secret: nextAuthSecret,
  });

  if (!user?.id || !token) {
    throw new Error("Unauthenticated");
  }

  const isTokenNew = getDiffTimeInSecounds({ iat: user.iat as number }) < 10;

  const existingSession = await db.query.sessions.findFirst({
    where: eq(sessions.jwt, token),
  });

  if (!existingSession && isTokenNew) {
    const userId = BigInt(user.id);
    if (USER_ONLY_HAVE_A_SESSION) {
      await db.delete(sessions).where(eq(sessions.user_id, userId));
    }

    const currentDate = getCurrentDate();
    currentDate.setHours(currentDate.getHours() + 12);

    await db.transaction(async (tx) => {
      // Store jwt to session table
      await tx.insert(sessions).values({
        jwt: token,
        user_id: userId,
        expired_at: currentDate,
      });
    });
  }

  return redirect("/redirect");
}

function getDiffTimeInSecounds({ iat }: { iat: number }) {
  // NOTE: keep using server time cause jwt generated by server using UTC
  const userTokenIssuedAt = new Date(iat * 1000);
  const currentDatetime = new Date();

  const diffTime = differenceInSeconds(currentDatetime, userTokenIssuedAt);

  return diffTime;
}
