"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterParadisQCashierReport({
  users,
}: {
  users: {
    id: bigint;
    name: string;
  }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    userId: string;
    startDate: string;
    endDate: string;
  }>({
    userId: "",
    startDate: "",
    endDate: "",
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.userId) query.userId = queryParams.userId;
    if (queryParams.startDate && queryParams.endDate) {
      query.startDate = queryParams.startDate;
      query.endDate = queryParams.endDate;
    }

    const queryParamsItems = new URLSearchParams(query);
    router.push(
      `/report/paradisq-cashier-report?${queryParamsItems.toString()}`,
      {
        scroll: false,
      },
    );
  };

  useEffect(() => {
    const userId = searchParams.get("userId") ?? "all";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";

    setQueryParams({
      userId,
      startDate,
      endDate,
    });
  }, [searchParams]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            value={queryParams.startDate}
            onChange={(e: BaseSyntheticEvent) =>
              setQueryParams({
                ...queryParams,
                startDate: e.target.value,
              })
            }
            type="datetime-local"
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            value={queryParams.endDate}
            onChange={(e: BaseSyntheticEvent) =>
              setQueryParams({
                ...queryParams,
                endDate: e.target.value,
              })
            }
            min={queryParams.startDate}
            type="datetime-local"
          />
        </div>
        <div className="space-y-2">
          <Label>Employee</Label>
          <Select
            value={queryParams.userId}
            onValueChange={(userId: string) =>
              setQueryParams({ ...queryParams, userId: userId })
            }
          >
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {users.map((user) => (
                  <SelectItem value={user.id.toString()} key={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={handleButtonFilterOnClick}
        className="flex items-center gap-2"
      >
        <Check />
        <span>Submit</span>
      </Button>
    </div>
  );
}
