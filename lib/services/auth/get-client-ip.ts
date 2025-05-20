import { headers } from "next/headers";

export default async function getClientIp(): Promise<string> {
  // Warning: The "x-forwarded-for" header can be easily spoofed by the client.
  // Do not rely on this for secure IP validation. Use a trusted proxy or edge runtime IP extraction if possible
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const rawClientIp = forwarded ? forwarded.split(",")[0].trim() : "Unknown";
  let clientIp = rawClientIp.replace(/^::ffff:/, "");

  if (process.env.NODE_ENV === "development" || clientIp === "::1") {
    clientIp = "127.0.0.1";
  }

  return clientIp;
}
