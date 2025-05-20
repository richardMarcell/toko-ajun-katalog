"use client";
import { cn } from "@/lib/utils";
import getSidebarNavigation from "@/repositories/get-sidebar-navigation";
import { useSidebarStore } from "@/store/useSidebarStore";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LucideProps } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import SideBarMenu from "./SidebarMenu";

type SidebarItemType = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  show: boolean;
};

const Sidebar = ({ session }: { session: Session | null }) => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [navigation, setNavigation] = useState<SidebarItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const getNavigation = async () => {
        const navigationData = await getSidebarNavigation();

        if (navigationData) {
          setNavigation(navigationData.filter((item) => item.show));
        }
      };

      getNavigation().then(() => {
        setIsLoading(false);
      });
    }
  }, [session]); // Empty array means this runs once when the component mounts

  if (navigation.length === 0 && isLoading) {
    return <SidebarSkeleton isCollapsed={isCollapsed} />;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen overflow-hidden border-r bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b">
        <button
          onClick={toggleSidebar}
          className="flex h-full w-full items-center px-4"
        >
          <div className="h-6 w-6 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="ChronoSpace Logo"
              width={32}
              height={32}
            />
          </div>
          <span
            className={cn(
              "ml-3 flex-shrink-0 text-xl font-semibold text-blue-600 transition-all duration-300",
              isCollapsed
                ? "-translate-x-10 opacity-0"
                : "translate-x-0 opacity-100",
            )}
          >
            Satelite
          </span>
        </button>
      </div>

      <nav className="py-4">
        <ScrollArea className="h-[calc(100vh-96px)]">
          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            {navigation.map(
              (sidebarItem) =>
                sidebarItem.show && (
                  <SideBarMenu
                    key={sidebarItem.name}
                    sidebarItem={sidebarItem}
                    isCollapsed={isCollapsed}
                  />
                ),
            )}
          </TooltipProvider>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </nav>
    </aside>
  );
};

function SidebarSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r bg-white",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="space-y-4 py-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="mx-4 h-8 animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
