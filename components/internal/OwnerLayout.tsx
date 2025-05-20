"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Session } from "next-auth";
import Header from "./Header";
import Sidebar from "./Sidebar";

export function OwnerLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const { isCollapsed } = useSidebarStore();
  return (
    <div className="flex h-screen">
      <Sidebar session={session} />
      <div className="flex-1">
        <Header session={session} />
        <main
          className={cn(
            `min-h-screen flex-1 bg-[#FCFBFC] p-4 pt-24 transition-all duration-300`,
            isCollapsed ? "ml-16" : "ml-64",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
