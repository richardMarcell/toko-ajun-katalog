import { cookies } from "next/headers";

export async function deleteAuthCookie(): Promise<void> {
  const cookieStore = cookies();
  // if (process.env.NODE_ENV === "production")
  //   (await cookieStore).delete("__Secure-next-auth.session-token");
  // else (await cookieStore).delete("next-auth.session-token");
  (await cookieStore).delete("next-auth.session-token");
}
