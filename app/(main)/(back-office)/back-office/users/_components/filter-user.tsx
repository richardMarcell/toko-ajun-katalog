"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
  }>({
    keyword: "",
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/back-office/users?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";

    setQueryParams({
      keyword,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Cari berdasarkan nama, email atau username pengguna"
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
