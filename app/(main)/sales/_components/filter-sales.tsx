"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  getSalesDisplayTransactionType,
  SalesTransactionTypeEnum,
} from "@/lib/enums/SalesTransactionType";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { cn, formaterDate, getCurrentDate } from "@/lib/utils";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export default function FilterSales() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
    date: string;
    businessUnits: string[];
    transactionTypes: string[];
  }>({
    keyword: "",
    date: formaterDate(getCurrentDate(), "shortDate"),
    businessUnits: [],
    transactionTypes: [],
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;
    if (queryParams.date) query.date = format(queryParams.date, "yyyy-MM-dd");
    if (queryParams.businessUnits.length > 0)
      query.businessUnits = queryParams.businessUnits.join(",");
    if (queryParams.transactionTypes.length > 0)
      query.transactionTypes = queryParams.transactionTypes.join(",");

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/sales?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const businessUnits = searchParams.get("businessUnits")?.split(",") ?? [];
    const transactionTypes =
      searchParams.get("transactionTypes")?.split(",") ?? [];
    const searchParamsdate = searchParams.get("date");

    const date = searchParamsdate
      ? searchParamsdate
      : formaterDate(getCurrentDate(), "shortDate");

    setQueryParams({
      keyword,
      date,
      businessUnits,
      transactionTypes,
    });
  }, [searchParams]);

  return (
    <div className="space-y-2">
      <div className="grid w-full grid-cols-2 gap-2">
        <Input
          placeholder="Cari berdasarkan kode penjualan"
          autoComplete="off"
          className="h-12"
          value={queryParams.keyword}
          onChange={(e: BaseSyntheticEvent) =>
            setQueryParams({ ...queryParams, keyword: e.target.value })
          }
        />

        <Input
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
            "h-12 pl-3 text-left font-normal",
            !queryParams.date && "text-muted-foreground",
          )}
        />
        <MultiSelect
          options={Object.values(UnitBusinessSateliteQubuEnum).map(
            (businessUnit) => ({
              label: getDisplayUnitBusinessSatelite(businessUnit),
              value: businessUnit,
            }),
          )}
          key={
            queryParams.businessUnits.length > 0
              ? queryParams.businessUnits.map((id) => id).join("-")
              : "business-units-placeholder"
          }
          defaultValue={queryParams.businessUnits}
          onValueChange={(businessUnits) =>
            setQueryParams({ ...queryParams, businessUnits })
          }
          placeholder="Pilih unit bisnis"
          className="h-12"
        />
        <MultiSelect
          options={Object.values(SalesTransactionTypeEnum).map(
            (transactionType) => ({
              label: getSalesDisplayTransactionType(transactionType),
              value: transactionType,
            }),
          )}
          key={
            queryParams.transactionTypes.length > 0
              ? queryParams.transactionTypes.map((id) => id).join("-")
              : "transaction-types-placeholder"
          }
          defaultValue={queryParams.transactionTypes}
          onValueChange={(transactionTypes) =>
            setQueryParams({
              ...queryParams,
              transactionTypes: transactionTypes,
            })
          }
          placeholder="Pilih tipe transaksi"
          className="h-12"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleButtonFilterOnClick} className="h-12">
          <Filter />
        </Button>
      </div>
    </div>
  );
}
