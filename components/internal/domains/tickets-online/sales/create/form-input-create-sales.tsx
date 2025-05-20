"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTicketOrderContext } from "@/contexts/ticket-online-order-context";
import { ServerActionResponse } from "@/types/domains/server-action";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";
import { BaseSyntheticEvent } from "react";
import { TicketQuantitySelector } from "./ticket-quantity-selector";

export default function FormInputCreateSales({
  ticketProducts,
  customerOrigins,
  state,
}: {
  ticketProducts: Product[];
  customerOrigins: CustomerOrigin[];
  state: ServerActionResponse;
}) {
  const { setTicketSalesInput, ticketSalesInput } = useTicketOrderContext();

  return (
    <div className="pt-8">
      <div className="space-y-4">
        {ticketProducts.map((product) => (
          <TicketQuantitySelector product={product} key={product.id} />
        ))}
        {state?.errors?.sales_details && (
          <ValidationErrorMessage
            errorMessage={state.errors.sales_details.toString()}
          />
        )}
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_name">Nama</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            name="customer_name"
            id="customer_name"
            placeholder="Masukkan nama pelanggan"
            value={ticketSalesInput.customer_name}
            autoComplete="off"
            onChange={(e: BaseSyntheticEvent) =>
              setTicketSalesInput({
                ...ticketSalesInput,
                customer_name: e.target.value,
              })
            }
          />
          {state?.errors?.customer_name && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_name.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_phone_number">No. Hp</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            name="customer_phone_number"
            id="customer_phone_number"
            placeholder="Masukkan nomor Hp"
            value={ticketSalesInput.customer_phone_number}
            autoComplete="off"
            onChange={(e: BaseSyntheticEvent) =>
              setTicketSalesInput({
                ...ticketSalesInput,
                customer_phone_number: e.target.value.replace(/[^0-9]/g, ""),
              })
            }
          />
          {state?.errors?.customer_phone_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_phone_number.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label>Tempat Asal</Label>
            <span className="text-red-500">*</span>
          </div>
          <Select
            onValueChange={(customerOriginId: string) =>
              setTicketSalesInput({
                ...ticketSalesInput,
                customer_origin_id: Number(customerOriginId),
              })
            }
            value={ticketSalesInput.customer_origin_id?.toString() ?? " "}
            name="customer_origin_id"
          >
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih tempat asal" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={" "}>Pilih tempat asal</SelectItem>
                {customerOrigins.map((customerOrigin) => (
                  <SelectItem
                    key={customerOrigin.id}
                    value={customerOrigin.id.toString()}
                  >
                    {customerOrigin.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {state?.errors?.customer_origin_id && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_origin_id.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
