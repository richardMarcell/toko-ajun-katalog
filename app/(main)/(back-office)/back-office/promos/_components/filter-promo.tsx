"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { getPromoTypeCase, PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterPromo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
    types: string[];
  }>({
    keyword: "",
    types: [],
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;
    if (queryParams.types.length > 0) query.types = queryParams.types.join(",");

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/back-office/promos?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const types = searchParams.get("types")?.split(",") ?? [];

    setQueryParams({
      keyword,
      types,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Cari berdasarkan nama atau kode promo"
        autoComplete="off"
        className="h-12"
        value={queryParams.keyword}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, keyword: e.target.value })
        }
      />
      <MultiSelect
        options={Object.values(PromoTypeEnum).map((type) => ({
          label: getPromoTypeCase(type),
          value: type,
        }))}
        key={queryParams.types.map((type) => type).join("-")}
        defaultValue={queryParams.types}
        onValueChange={(types) =>
          setQueryParams({ ...queryParams, types: types })
        }
        placeholder="Pilih tipe promo"
      />
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
