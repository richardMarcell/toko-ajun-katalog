"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterTenant() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
    status: string[];
  }>({
    keyword: "",
    status: [],
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;
    if (queryParams.status.length > 0)
      query.status = queryParams.status.join(",");

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/back-office/tenants?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const status = searchParams.get("status")?.split(",") ?? [];

    setQueryParams({
      keyword,
      status,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Cari berdasarkan nama tenant"
        autoComplete="off"
        className="h-12"
        value={queryParams.keyword}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, keyword: e.target.value })
        }
      />
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
