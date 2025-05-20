"use client";

import { updateEntryPassDetailData } from "@/app/(main)/entry-pass/[entryPassCustomerId]/edit/_actions/update-entry-pass-detail-data";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
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
import {
  addToDate,
  formaterDate,
  formatNumberToCurrency,
  getCurrentDate,
} from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { EntryPassCustomerWithHistories } from "@/types/domains/entry-pass/edit";
import { Product } from "@/types/domains/entry-pass/general";
import { User } from "@/types/next-auth";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export function FormEditDetailData({
  products,
  user,
  entryPassCustomer,
  isUserCanEditDetailData,
}: {
  products: Product[];
  user: User;
  entryPassCustomer: EntryPassCustomerWithHistories;
  isUserCanEditDetailData: boolean;
}) {
  const [state, formAction] = useActionState(
    updateEntryPassDetailData,
    initialValue,
  );

  const initialHistory = entryPassCustomer.entryPassCustomerHistories[0] || {};
  const [entryPassData, setEntryPassData] = useState({
    product_id: initialHistory.product_id ?? null,
    register_date: formaterDate(
      initialHistory.registered_at ?? getCurrentDate(),
      "shortDate",
    ),
    valid_until: formaterDate(
      initialHistory.valid_until ?? getCurrentDate(),
      "shortDate",
    ),
  });

  const updateValidDate = (
    registerDate: string,
    productId: bigint | null,
  ): string => {
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );
    if (selectedProduct) {
      const validDate = addToDate(
        new Date(registerDate),
        selectedProduct.ep_valid_term ?? 0,
        "day",
      );
      return formaterDate(validDate, "shortDate");
    }
    return "";
  };

  const handleProductChange = (productId: string): void => {
    const productBigInt = BigInt(productId);
    setEntryPassData((prev) => ({
      ...prev,
      product_id: productBigInt,
      valid_until: updateValidDate(prev.register_date, productBigInt),
    }));
  };

  const handleRegisterDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const registerDate = e.target.value;
    setEntryPassData((prev) => ({
      ...prev,
      register_date: registerDate,
      valid_until: updateValidDate(registerDate, prev.product_id),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append(
        "entry_pass_customer_id",
        entryPassCustomer.id.toString(),
      );

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success") redirect("/entry-pass");
  }, [state]);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-bold">Informasi Entry Pass</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 space-y-2">
          <div>
            <Label htmlFor="product_id">Tipe</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Select
            value={entryPassData.product_id?.toString()}
            name="product_id"
            onValueChange={handleProductChange}
            disabled={!isUserCanEditDetailData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Pilih tipe</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name} (
                  {formatNumberToCurrency(Number(product.price))})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.product_id && (
            <ValidationErrorMessage
              errorMessage={state.errors.product_id.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="registered_at">Tanggal Pendaftaran</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            value={entryPassData.register_date}
            onChange={handleRegisterDateChange}
            type="date"
            id="registered_at"
            name="registered_at"
            autoComplete="off"
            min={formaterDate(getCurrentDate(), "shortDate")}
            disabled={!isUserCanEditDetailData}
          />
          {state.errors?.registered_at && (
            <ValidationErrorMessage
              errorMessage={state.errors.registered_at.toString()}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Tanggal Valid</Label>
          <Input
            value={entryPassData.valid_until}
            type="date"
            disabled
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label>Operator</Label>
          <Input disabled value={user.name} autoComplete="off" />
        </div>
      </div>
      {isUserCanEditDetailData && (
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-qubu_blue">
            Perbarui Entry Pass
          </Button>
        </div>
      )}
    </form>
  );
}
