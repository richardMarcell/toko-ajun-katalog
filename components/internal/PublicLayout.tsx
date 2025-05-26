import { Session } from "next-auth";
import React from "react";
import PublicHeader from "./PublicHeader";

export function PublicLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <>
      <PublicHeader session={session} />
      <main>{children}</main>
      <footer></footer>
    </>
  );
}
