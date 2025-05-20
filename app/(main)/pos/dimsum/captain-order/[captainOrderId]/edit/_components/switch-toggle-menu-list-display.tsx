"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SwitchToggleMenuListDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const displayMode = searchParams.get("displayMode") || "CARD";

  const handleTabButtonOnClick = (mode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("displayMode", mode);

    router.push(`?${params.toString()}`);
  };
  return (
    <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
      <button
        onClick={() => handleTabButtonOnClick("CARD")}
        className={cn(
          "rounded-md p-2",
          displayMode === "CARD" ? "bg-white text-qubu_blue" : "",
        )}
      >
        <LayoutDashboard />
      </button>
      <button
        onClick={() => handleTabButtonOnClick("TABLE")}
        className={cn(
          "rounded-md p-2",
          displayMode === "TABLE" ? "bg-white text-qubu_blue" : "",
        )}
      >
        <List />
      </button>
    </div>
  );
}
