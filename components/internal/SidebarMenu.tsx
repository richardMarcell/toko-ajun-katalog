"use client";

import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type SidebarItemType = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  show: boolean;
};

export default function SidebarMenu({
  sidebarItem,
  isCollapsed,
}: {
  sidebarItem: SidebarItemType;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === sidebarItem.href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          key={sidebarItem.name}
          href={sidebarItem.href}
          className={cn(
            "flex h-11 w-full items-center transition-colors",
            isCollapsed ? "px-4" : "px-4",
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <sidebarItem.icon
              className={cn("h-5 w-5", isActive && "text-blue-600")}
            />
          </div>
          <span
            className={cn(
              "ml-3 flex-shrink-0 truncate transition-all duration-300",
              isCollapsed
                ? "max-w-[1px] -translate-x-10 opacity-0"
                : "max-w-[192px] translate-x-0 opacity-100",
            )}
          >
            {sidebarItem.name}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{sidebarItem.name}</TooltipContent>
    </Tooltip>
  );
}
