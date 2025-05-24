"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCategory } from "@/types/product-category";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export function FilterProduct({
  productCategories,
}: {
  productCategories: ProductCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    keyword: string;
    productCategoryId: string;
  }>({
    keyword: "",
    productCategoryId: "",
  });

  const handleButtonFilterOnClick = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/products?${queryParamsItems.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const productCategoryId = searchParams.get("productCategoryId") ?? "";

    setQueryParams({
      keyword,
      productCategoryId,
    });
  }, [searchParams]);

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Cari berdasarkan nama atau kode produk"
        autoComplete="off"
        className="h-12"
        value={queryParams.keyword}
        onChange={(e: BaseSyntheticEvent) =>
          setQueryParams({ ...queryParams, keyword: e.target.value })
        }
      />
      <Select>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Pilih kategori produk" />
        </SelectTrigger>
        <SelectContent>
          {productCategories.map((productCategory) => {
            return (
              <SelectItem
                key={productCategory.id}
                value={productCategory.id.toString()}
              >
                {productCategory.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button onClick={handleButtonFilterOnClick} className="h-12">
        <Filter />
      </Button>
    </div>
  );
}
