"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SelectLocker({
  lockerList,
}: {
  lockerList: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    status: string;
    label: string;
    type: string;
  }[];
}) {
  const [selectedLockerIds, setSelectedLockerIds] = useState<number[]>([]);

  const toggleSelectedLocker = (selectedLockerId: number) => {
    const isSelected = selectedLockerIds.includes(selectedLockerId);

    setSelectedLockerIds((prevSelectedLockerIds) => {
      if (isSelected) {
        return prevSelectedLockerIds.filter(
          (lockerId) => lockerId !== selectedLockerId,
        );
      }

      return prevSelectedLockerIds.length < 1
        ? [...prevSelectedLockerIds, selectedLockerId]
        : prevSelectedLockerIds;
    });
  };

  return (
    <div className="w-[40%] space-y-6">
      {lockerList.length === 0 ? (
        <div className="w-full py-12">
          <p className="text-center text-2xl font-extralight text-gray-400">
            No Locker Available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-2">
          {lockerList.map((locker) => {
            const isLockerSelected = selectedLockerIds.includes(
              Number(locker.id),
            );
            return (
              <Button
                key={locker.id}
                className={cn(
                  "text-md h-10 w-10 rounded-md border p-2 text-center text-black hover:border-qubu_vivid_blue/50 hover:bg-qubu_vivid_blue/50 hover:text-white",
                  isLockerSelected
                    ? "bg-qubu_vivid_blue text-white"
                    : "bg-white",
                )}
                onClick={() => toggleSelectedLocker(Number(locker.id))}
              >
                {locker.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
