"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type ProductCategory = {
  id: bigint;
  name: string;
  total_products: number;
};

export function TabProductCategory({
  productCategories,
}: {
  productCategories: ProductCategory[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalProduct = productCategories.reduce((total, category) => {
    return total + category.total_products;
  }, 0);

  const handleTabOnClick = (productCategoryId: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (productCategoryId)
      queryParams.set("productCategoryId", productCategoryId);
    else queryParams.delete("productCategoryId");

    router.push(`?${queryParams.toString()}`);
  };

  return (
    <div className="w-1/5 pt-8">
      <h1 className="text-xl">Kategori Menu</h1>
      <ScrollArea className="h-[calc(100vh-155px)]">
        <div className="flex flex-col gap-4 pt-4" data-testid="tenants-button">
          <TabProductCategoryItem
            title="All Items"
            description={`${totalProduct} items`}
            isActive={!searchParams.get("productCategoryId")}
            onClick={() => handleTabOnClick("")}
            data-testid="tenant-all-items"
          />

          {productCategories.map((category) => (
            <TabProductCategoryItem
              description={`${category.total_products} items`}
              title={category.name}
              key={category.id}
              isActive={
                Number(category.id) ==
                Number(searchParams.get("productCategoryId"))
              }
              onClick={() => handleTabOnClick(category.id.toString())}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function TabProductCategoryItem({
  title,
  description,

  isActive,
  ...props
}: {
  title: string;
  description: string;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      role="button"
      className={cn(
        "flex w-64 gap-2 rounded-2xl border bg-white p-3 hover:bg-qubu_blue hover:text-white xl:w-full",
        isActive ? "bg-qubu_blue text-white" : "",
      )}
    >
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
