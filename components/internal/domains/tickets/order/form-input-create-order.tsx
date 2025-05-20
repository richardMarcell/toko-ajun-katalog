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
import { useTicketOrderContext } from "@/contexts/ticket-order-context";
import { ServerActionResponse } from "@/types/domains/server-action";
import { CustomerOrigin, Product } from "@/types/domains/tickets/sales/general";
import { BaseSyntheticEvent } from "react";
import { TicketQuantitySelector } from "./ticket-quantity-selector";

export default function FormInputCreateOrder({
  ticketProducts,
  customerOrigins,
  state,
}: {
  ticketProducts: Product[];
  customerOrigins: CustomerOrigin[];
  state: ServerActionResponse;
}) {
  const { setTicketSalesTemporaryInput, ticketSalesTemporaryInput } =
    useTicketOrderContext();

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
          {/* Check point */}
          <Input
            name="customer_name"
            id="customer_name"
            autoComplete="off"
            placeholder="Masukkan nama pelanggan"
            value={ticketSalesTemporaryInput.customer_name}
            onChange={(e: BaseSyntheticEvent) =>
              setTicketSalesTemporaryInput({
                ...ticketSalesTemporaryInput,
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
            autoComplete="off"
            placeholder="Masukkan nomor Hp"
            value={ticketSalesTemporaryInput.customer_phone_number}
            onChange={(e: BaseSyntheticEvent) =>
              setTicketSalesTemporaryInput({
                ...ticketSalesTemporaryInput,
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
              setTicketSalesTemporaryInput({
                ...ticketSalesTemporaryInput,
                customer_origin_id: Number(customerOriginId),
              })
            }
            value={
              ticketSalesTemporaryInput.customer_origin_id?.toString() ?? ""
            }
            name="customer_origin_id"
          >
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih tempat asal" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
