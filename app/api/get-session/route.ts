import { db } from "@/db";
import { sessions } from "@/db/schema";
import { getCurrentDate } from "@/lib/utils";
import { isBefore } from "date-fns";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { token, userId, api_key } = await request.json();

  if (api_key === process.env.API_KEY) {
    const session = await db.query.sessions.findFirst({
      where: and(eq(sessions.jwt, token), eq(sessions.user_id, BigInt(userId))),
    });

    if (!session)
      return Response.json({
        isTokenValid: false,
      });

    const isExpired = isBefore(session.expired_at, getCurrentDate());

    if (isExpired) {
      await db.delete(sessions).where(eq(sessions.id, session.id));

      return Response.json({
        isTokenValid: false,
      });
    }

    return Response.json({
      isTokenValid: true,
    });
  } else {
    return Response.json(
      {
        status: "error",
        message: "Invalid API Key",
      },
      {
        status: 401, // Unauthorized
      },
    );
  }
}
