"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tenant } from "@/types/domains/pos/food-corner/sales/order";
import { Ham } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function TabTenant({ tenants }: { tenants: Tenant[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalProduct = tenants.reduce((total, tenant) => {
    return total + tenant.total_products;
  }, 0);

  const handleTabOnClick = (tenantId: string) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (tenantId) queryParams.set("tenantId", tenantId);
    else queryParams.delete("tenantId");

    router.push(`?${queryParams.toString()}`);
  };

  return (
    <div className="w-1/5">
      <h1 className="text-2xl">{"Station's"}</h1>
      <ScrollArea className="h-[calc(100vh-155px)]">
        <div className="flex flex-col gap-4 pt-4" data-testid="tenants-button">
          <TabTenantItemWithIcon
            title="All Items"
            description={`${totalProduct} items`}
            icon={<Ham />}
            isActive={!searchParams.get("tenantId")}
            onClick={() => handleTabOnClick("")}
            data-testid="tenant-all-items"
          />

          {tenants.map((tenant) => (
            <TabTenantItemWithImage
              imageSource={tenant.image}
              description={`${tenant.total_products} items`}
              title={tenant.name}
              key={tenant.id}
              isActive={
                Number(tenant.id) == Number(searchParams.get("tenantId"))
              }
              onClick={() => handleTabOnClick(tenant.id.toString())}
              data-testid={`tenant-${tenant.id}`}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function TabTenantItemWithImage({
  title,
  description,
  imageSource,
  isActive,
  ...props
}: {
  title: string;
  description: string;
  imageSource: string;
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
      <Image
        src={imageSource}
        alt={title}
        width={40}
        height={10}
        className="rounded-lg"
      />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

function TabTenantItemWithIcon({
  title,
  description,
  icon,
  isActive,
  ...props
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
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
      <div className="rounded-lg bg-gray-100 p-2 text-black">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
