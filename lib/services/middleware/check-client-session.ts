import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { deleteAuthCookie } from "../auth/delete-auth-cookie";

export default async function checkClientSession({
  req,
}: {
  req: NextRequestWithAuth;
}): Promise<{ isUserSessionValid: boolean }> {
  const user = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!user) return { isUserSessionValid: false };

  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });

  const responseSession = await fetch(
    `${process.env.URL_LOCAL}/api/get-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        userId: parseInt(user.id.toString()),
        api_key: process.env.API_KEY,
      }),
    },
  );

  const sessionData = (await responseSession.json()) as {
    isTokenValid: boolean;
  };

  if (!sessionData.isTokenValid) {
    await deleteAuthCookie();
    return { isUserSessionValid: false };
  }

  return { isUserSessionValid: true };
}
