import { NextRequestWithAuth } from "next-auth/middleware";
import getClientIp from "../auth/get-client-ip";
import { getToken } from "next-auth/jwt";

export async function storeActivitylog({
  req,
}: {
  req: NextRequestWithAuth;
}): Promise<void> {
  const clientIp = await getClientIp();

  const user = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;
  const queryObject = Object.fromEntries(searchParams.entries());

  await fetch(`${process.env.URL_LOCAL}/api/store-activity-log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ip_address: clientIp,
      user_id: user?.id,
      endpoint: pathname,
      payloads: searchParams.size > 0 ? JSON.stringify(queryObject) : null,
      api_key: process.env.API_KEY,
    }),
  });
}
