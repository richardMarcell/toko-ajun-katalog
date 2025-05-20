import { db } from "@/db";
import { ipLocations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { client_ip, api_key } = await request.json();

  if (api_key === process.env.API_KEY) {
    const ipLocation = await db.query.ipLocations.findFirst({
      where: eq(ipLocations.ip_address, client_ip),
    });

    if (!ipLocation)
      return Response.json({
        isClientIpAllowed: false,
      });

    return Response.json({
      isClientIpAllowed: true,
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
