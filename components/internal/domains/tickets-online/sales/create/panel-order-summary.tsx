"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { VendorType } from "@/types/vendor-type";
import Image from "next/image";
import { BaseSyntheticEvent } from "react";

export default function PanelOrderSummary({
  vendorTypes,
  state,
}: {
  vendorTypes: VendorType[];
  state: ServerActionResponse;
}) {
  const { ticketSalesInput, setTicketSalesInput, initialTicketSales } =
    useTicketOrderContext();

  const handleCancel = () => {
    setTicketSalesInput(initialTicketSales);
  };

  return (
    <div className="w-[40%]">
      <Image
        src="/assets/imgs/header-card.png"
        alt="header-card"
        width={600}
        height={0}
        className="w-full rounded-lg object-contain p-1"
      />
      <Card className="rounded-tl-none rounded-tr-none border">
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div>
              <Label>Agen Penjual</Label>
              <span className="text-red-500">*</span>
            </div>
            <Select
              onValueChange={(vendorTypeCode: string) =>
                setTicketSalesInput({
                  ...ticketSalesInput,
                  vendor_type_code: vendorTypeCode,
                })
              }
              value={ticketSalesInput.vendor_type_code?.toString() ?? " "}
              name="vendor_type_code"
            >
              <SelectTrigger className="mt-4 w-full bg-white">
                <SelectValue placeholder="Pilih agen penjual" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={" "}>Pilih agen penjual</SelectItem>
                  {vendorTypes.map((vendorType) => (
                    <SelectItem key={vendorType.code} value={vendorType.code}>
                      {vendorType.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {state?.errors?.vendor_type_code && (
              <ValidationErrorMessage
                errorMessage={state.errors.vendor_type_code.toString()}
              />
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="ota_redeem_code">Redeem Code</Label>
              <span className="text-qubu_red">*</span>
            </div>
            <Input
              name="ota_redeem_code"
              id="ota_redeem_code"
              placeholder="Masukkan redeem code"
              value={ticketSalesInput.ota_redeem_code}
              autoComplete="off"
              onChange={(e: BaseSyntheticEvent) =>
                setTicketSalesInput({
                  ...ticketSalesInput,
                  ota_redeem_code: e.target.value,
                })
              }
            />
            {state?.errors?.ota_redeem_code && (
              <ValidationErrorMessage
                errorMessage={state.errors.ota_redeem_code.toString()}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="mt-4 w-full bg-black p-2" type="submit">
            Proceed
          </Button>
          <Button
            onClick={handleCancel}
            className="mt-4 w-full bg-black/50 p-2"
            type="button"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
