"use client";

import logOut from "@/app/_actions/log-out";
import { Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Lock, LogOut, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const SCROLL_TRIGGER = 100; // px

const PublicHeader = ({ session }: { session: Session | null }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const userName = session?.user?.name || "Guest";
  const userEmail = session?.user.email || "-";

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > SCROLL_TRIGGER);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed left-0 right-0 z-50 flex items-center justify-between border bg-white px-6 py-3 shadow-lg"
        >
          <div className="text-2xl font-black text-red-600">
            T<span className="text-black">A</span>
          </div>

          {!session && (
            <Button asChild>
              <Link className="flex gap-2" href={"/auth/login"}>
                <Lock />
                <span>Login</span>
              </Link>
            </Button>
          )}

          {session && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-gray-100"
              >
                <Avatar className="flex items-center justify-center border-2 font-bold">
                  {getInitials(userName)}
                </Avatar>
                <div className="text-left text-sm">
                  <p className="font-bold">{userName}</p>
                  <p className="text-xs font-medium text-gray-500">
                    {userEmail}
                  </p>
                </div>
              </button>

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
                      signOut({ callbackUrl: "/redirect" });
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
          )}
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default PublicHeader;
