import getClientIp from "../auth/get-client-ip";

export default async function checkClientIpAccess(): Promise<boolean> {
  const clientIp = await getClientIp();

  const responseIpCheck = await fetch(
    `${process.env.URL_LOCAL}/api/check-ip-access`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_ip: clientIp,
        api_key: process.env.API_KEY,
      }),
    },
  );

  const responseIpCheckJson = (await responseIpCheck.json()) as {
    isClientIpAllowed: boolean;
  };

  return responseIpCheckJson.isClientIpAllowed;
}
