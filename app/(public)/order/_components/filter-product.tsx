"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCategory } from "@/types/product-category";
import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleFilter = () => {
    const query: Record<string, string> = {};

    if (queryParams.keyword) query.keyword = queryParams.keyword;
    if (queryParams.productCategoryId)
      query.productCategoryId = queryParams.productCategoryId;

    const queryParamsItems = new URLSearchParams(query);
    router.push(`/order?${queryParamsItems.toString()}`, {
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
    <div className="flex w-full flex-col gap-4 rounded-xl p-4 shadow md:flex-row md:items-end md:gap-6">
      <div className="flex-1">
        <Label className="mb-1 block text-sm font-medium text-[#204B4E]">
          Cari Produk
        </Label>
        <div className="relative">
          <Input
            placeholder="Nama produk"
            value={queryParams.keyword}
            onChange={(e) =>
              setQueryParams((prev) => ({ ...prev, keyword: e.target.value }))
            }
            className="h-12 pl-10"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="w-full md:w-64">
        <Label className="mb-1 block text-sm font-medium text-[#204B4E]">
          Kategori
        </Label>
        <Select
          value={queryParams.productCategoryId}
          onValueChange={(val) =>
            setQueryParams((prev) => ({ ...prev, productCategoryId: val }))
          }
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Pilih kategori produk" />
          </SelectTrigger>
          <SelectContent>
            {productCategories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tombol filter */}
      <div className="w-full md:w-auto">
        <label className="mb-1 block select-none text-transparent">.</label>
        <Button
          onClick={handleFilter}
          className="flex h-12 w-full items-center gap-2 bg-[#204B4E] text-white hover:bg-[#18393B]"
        >
          <Filter size={18} />
          Terapkan
        </Button>
      </div>
    </div>
  );
}
