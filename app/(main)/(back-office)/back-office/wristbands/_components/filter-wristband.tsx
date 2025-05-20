"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  getWristbandStatusCase,
  WristbandStatusEnum,
} from "@/lib/enums/WristbandStatusEnum";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterWristband() {
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
    router.push(`/back-office/wristbands?${queryParamsItems.toString()}`, {
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
        placeholder="Cari berdasarkan kode gelang"
        autoComplete="off"
        className="h-12"
        value={queryParams.keyword}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, keyword: e.target.value })
        }
      />
      <MultiSelect
        options={Object.values(WristbandStatusEnum).map((status) => ({
          label: getWristbandStatusCase(status),
          value: status,
        }))}
        key={queryParams.status.map((id) => id).join("-")}
        defaultValue={queryParams.status}
        onValueChange={(status) =>
          setQueryParams({ ...queryParams, status: status })
        }
        placeholder="Pilih status gelang"
      />
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
