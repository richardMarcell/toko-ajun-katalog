"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToDate, formaterDate } from "@/lib/utils";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSalesStatusCase,
  SalesStatusEnum,
} from "@/lib/enums/SalesStatusEnum";

export function FilterSales() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    status: string;
    startDate: string;
    endDate: string;
  }>({
    status: "",
    startDate: formaterDate(new Date(), "shortDate"),
    endDate: formaterDate(addToDate(new Date(), 1, "year"), "shortDate"),
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.status) query.status = queryParams.status;
    if (queryParams.startDate)
      query.startDate = format(queryParams.startDate, "yyyy-MM-dd");
    if (queryParams.endDate)
      query.endDate = format(queryParams.endDate, "yyyy-MM-dd");

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/sales?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const status = searchParams.get("status") ?? "";
    const searchParamsStartDate = searchParams.get("startDate") ?? "";
    const searchParamsEndDate = searchParams.get("endDate") ?? "";

    const startDate = searchParamsStartDate
      ? searchParamsStartDate
      : formaterDate(new Date(), "shortDate");

    const endDate = searchParamsEndDate
      ? searchParamsEndDate
      : formaterDate(addToDate(new Date(), 1, "year"), "shortDate");

    setQueryParams({
      status,
      startDate,
      endDate,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      <Input
        type="date"
        autoComplete="off"
        className="h-12"
        value={queryParams.startDate}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, startDate: e.target.value })
        }
      />
      <Input
        type="date"
        autoComplete="off"
        className="h-12"
        value={queryParams.endDate}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, endDate: e.target.value })
        }
        min={queryParams.startDate}
      />

      <Select
        value={queryParams.status}
        onValueChange={(value: string) =>
          setQueryParams({ ...queryParams, status: value })
        }
      >
        <SelectTrigger className="h-12 w-full bg-white">
          <SelectValue placeholder="Pilih Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(SalesStatusEnum).map((status) => {
              return (
                <SelectItem key={status} value={status}>
                  {getSalesStatusCase(status)}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
