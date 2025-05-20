import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    ip_address,
    user_id,
    endpoint,
    payloads,
    api_key,
  }: {
    ip_address: string;
    user_id: string | null;
    endpoint: string;
    payloads: string | null;
    api_key: string;
  } = await request.json();

  if (api_key === process.env.API_KEY) {
    await db.insert(activityLogs).values({
      ip_address: ip_address,
      user_id: user_id ? BigInt(user_id) : null,
      payloads: payloads ? JSON.parse(payloads) : null,
      endpoint: endpoint,
    });

    return Response.json({
      status: "success",
      message: "Success store activity log",
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
