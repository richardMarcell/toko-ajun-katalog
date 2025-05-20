"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formaterDate, getCurrentDate } from "@/lib/utils";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterSaleWaterparkTickets() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
    date: string;
  }>({
    keyword: "",
    date: formaterDate(getCurrentDate(), "shortDate"),
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;
    if (queryParams.date) query.date = format(queryParams.date, "yyyy-MM-dd");

    const queryParamsItems = new URLSearchParams(query);
    router.push(
      `/back-office/sales-waterpark-ticket?${queryParamsItems.toString()}`,
      {
        scroll: false,
      },
    );
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const searchParamsdate = searchParams.get("date");

    const date = searchParamsdate
      ? searchParamsdate
      : formaterDate(getCurrentDate(), "shortDate");

    setQueryParams({
      keyword,
      date,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      {/* <Input
        placeholder="Cari berdasarkan nama atau email pengguna"
        autoComplete="off"
        className="h-12"
        value={queryParams.keyword}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, keyword: e.target.value })
        }
      /> */}

      <Input
        id="date"
        type="date"
        autoComplete="off"
        value={queryParams.date}
        max={formaterDate(getCurrentDate(), "shortDate")}
        onChange={(e: BaseSyntheticEvent) => {
          setQueryParams({
            ...queryParams,
            date: e.target.value,
          });
        }}
        className={cn(
          "h-12 w-[240px] pl-3 text-left font-normal",
          !queryParams.date && "text-muted-foreground",
        )}
      />
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
