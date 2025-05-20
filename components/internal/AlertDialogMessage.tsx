"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from "lucide-react";

export function AlertDialogMessage({
  type,
  message,
  isOpen,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isSuccess = type === "success";

  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent className="rounded-lg p-6 shadow-xl">
        <AlertDialogHeader className="flex flex-col items-center space-y-3">
          {isSuccess ? (
            <CircleCheck size={60} className="text-qubu_green" />
          ) : (
            <CircleX size={60} className="text-qubu_red" />
          )}
          <AlertDialogTitle
            className={cn(
              "text-3xl font-semibold",
              isSuccess ? "text-qubu_green" : "text-qubu_red",
            )}
          >
            {isSuccess ? "SUCCESS" : "ERROR"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-md text-center text-gray-700">
          {message}
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogAction
            className={cn(
              "w-full rounded-md py-3 text-lg font-semibold transition-all",
              isSuccess
                ? "bg-qubu_green hover:bg-green-700 focus:ring focus:ring-green-300"
                : "bg-qubu_red hover:bg-red-700 focus:ring focus:ring-red-300",
            )}
            onClick={onClose}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
