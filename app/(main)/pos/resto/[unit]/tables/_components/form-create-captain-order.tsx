"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
import { getOrderTypeCase, OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import {
  getCaptainOrderComplimentCase,
  CaptainOrderComplimentEnum,
} from "@/lib/enums/CaptainOrderComplimentEnum";
import {
  getCaptainOrderMealTimeCase,
  CaptainOrderMealTimeEnum,
} from "@/lib/enums/CaptainOrderMealTimeEnum";
import {
  getCaptainOrderOutletCase,
  CaptainOrderOutleEnum,
} from "@/lib/enums/CaptainOrderOutletEnum";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { User } from "@/types/next-auth";
import { Room } from "@/types/room";
import { Table } from "@/types/table";
import { Check, X } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { storeCaptainOrder } from "../_actions/store-captain-order";

export function FormCreateCaptainOrder({
  table,
  room,
  user,
}: {
  table?: Table;
  room?: Room;
  user: User;
}) {
  const searchParams = useSearchParams();
  const outletParam = searchParams.get("outlet");
  const outlet =
    outletParam && outletParam.trim() !== ""
      ? outletParam
      : CaptainOrderOutleEnum.PATIO_BISTRO;

  const [state, formAction] = useActionState(storeCaptainOrder, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const isPatioBistro = outlet === CaptainOrderOutleEnum.PATIO_BISTRO;
      const isRoomServices = outlet === CaptainOrderOutleEnum.ROOM_SERVICES;

      const formData = new FormData(e.currentTarget);
      formData.set("outlet", outlet);

      if (isPatioBistro && table) {
        formData.set("table_id", table.id.toString());
      }

      if (isRoomServices && room) {
        formData.set("room_id", room.id.toString());
      }

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status == "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="space-y-2">
          <div>
            <Label htmlFor="meal_time">Meal Times</Label>
            <span className="text-red-500">*</span>
          </div>

          <Select name="meal_time">
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih Meal Times" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(CaptainOrderMealTimeEnum).map((mealTime) => (
                  <SelectItem key={mealTime} value={mealTime}>
                    {getCaptainOrderMealTimeCase(mealTime)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {state?.errors?.meal_time && (
            <ValidationErrorMessage
              errorMessage={state.errors.meal_time.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="outlet">Outlet</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            type="text"
            placeholder="Masukkan outlet resto"
            value={getCaptainOrderOutletCase(outlet as CaptainOrderOutleEnum)}
            disabled
          />
          {state?.errors?.outlet && (
            <ValidationErrorMessage
              errorMessage={state.errors.outlet.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="compliment">Compliment</Label>
            <span className="text-red-500">*</span>
          </div>

          <Select name="compliment">
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih Compliment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(CaptainOrderComplimentEnum).map((compliment) => (
                  <SelectItem key={compliment} value={compliment}>
                    {getCaptainOrderComplimentCase(compliment)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {state?.errors?.compliment && (
            <ValidationErrorMessage
              errorMessage={state.errors.compliment.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label>Table/Room</Label>
            <span className="text-red-500">*</span>
          </div>

          {outlet === CaptainOrderOutleEnum.PATIO_BISTRO && table && (
            <>
              <Input
                type="text"
                placeholder="Masukkan nomor meja atau nomor kamar"
                value={table.name}
                disabled
              />
              {state?.errors?.table_id && (
                <ValidationErrorMessage
                  errorMessage={state.errors.table_id.toString()}
                />
              )}
            </>
          )}

          {outlet === CaptainOrderOutleEnum.ROOM_SERVICES && room && (
            <>
              <Input
                type="text"
                placeholder="Masukkan nomor meja atau nomor kamar"
                value={room.name}
                disabled
              />
              {state?.errors?.room_id && (
                <ValidationErrorMessage
                  errorMessage={state.errors.room_id.toString()}
                />
              )}
            </>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="order_type">Tipe pesanan</Label>
            <span className="text-red-500">*</span>
          </div>

          <Select name="order_type">
            <SelectTrigger className="mt-4 w-full bg-white">
              <SelectValue placeholder="Pilih tipe pesanan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(OrderTypeEnum).map((orderType) => (
                  <SelectItem key={orderType} value={orderType}>
                    {getOrderTypeCase(orderType)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {state?.errors?.order_type && (
            <ValidationErrorMessage
              errorMessage={state.errors.order_type.toString()}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <div>
              <Label htmlFor="customer_adult_count">Adult</Label>
              <span className="text-red-500">*</span>
            </div>

            <Input
              id="customer_adult_count"
              type="number"
              name="customer_adult_count"
              placeholder="Masukkan jumlah orang dewasa"
              defaultValue={0}
              min={0}
            />
            {state?.errors?.customer_adult_count && (
              <ValidationErrorMessage
                errorMessage={state.errors.customer_adult_count.toString()}
              />
            )}
          </div>
          <div className="space-y-2">
            <div>
              <Label htmlFor="customer_child_count">Child</Label>
              <span className="text-red-500">*</span>
            </div>

            <Input
              id="customer_child_count"
              type="number"
              name="customer_child_count"
              placeholder="Masukkan jumlah anak-anak"
              defaultValue={0}
              min={0}
            />
            {state?.errors?.customer_child_count && (
              <ValidationErrorMessage
                errorMessage={state.errors.customer_child_count.toString()}
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="customer_name">Nama Pelanggan</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            type="text"
            placeholder="Masukkan nama pelanggan"
            name="customer_name"
            id="customer_name"
          />

          {state?.errors?.customer_name && (
            <ValidationErrorMessage
              errorMessage={state.errors.customer_name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="outlet">Waitress</Label>
            <span className="text-red-500">*</span>
          </div>

          <Input
            type="text"
            placeholder="Masukkan nama waitress"
            value={user.name}
            disabled
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <DialogClose asChild>
          <Button variant={"secondary"} className="flex gap-2">
            <X />
            <span>Cancel</span>
          </Button>
        </DialogClose>
        <Button className="flex gap-2 bg-qubu_blue" type="submit">
          <Check />
          <span>Simpan</span>
        </Button>
      </div>
    </form>
  );
}
