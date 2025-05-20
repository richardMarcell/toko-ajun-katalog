"use client";
import logOut from "@/app/_actions/log-out";
import { Avatar } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { LogOut, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Header = ({ session }: { session: Session | null }) => {
  const { isCollapsed } = useSidebarStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = session?.user?.name || "Guest";
  const userEmail = session?.user.email || "-";

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-end border-b bg-white px-6 transition-all duration-300",
        isCollapsed ? "left-16" : "left-64",
      )}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-gray-50"
          >
            <Avatar className="flex items-center justify-center border-2 font-bold">
              {getInitials(userName)}
            </Avatar>
            <div className="text-left">
              {!session ? (
                <>
                  <div className="mb-1 h-5 w-24 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                </>
              ) : (
                <>
                  <p className="font-bold">{userName}</p>
                  <p className="text-xs font-medium">{userEmail}</p>
                </>
              )}
            </div>
          </button>

          {/* User Menu Popup */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={async () => {
                  await logOut({ userSession: session?.user });
                  signOut({ callbackUrl: "/auth/login" });
                  setShowUserMenu(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
