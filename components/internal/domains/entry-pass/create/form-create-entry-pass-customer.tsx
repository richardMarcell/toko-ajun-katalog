"use client";

import { storeEntryPassCustomer } from "@/app/(main)/entry-pass/create/_actions/store-entry-pass-customer";
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
import { Product } from "@/types/domains/entry-pass/general";
import { User } from "@/types/next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export function FormCreateEntryPassCustomer({
  products,
  user,
}: {
  products: Product[];
  user: User;
}) {
  const [state, formAction] = useActionState(
    storeEntryPassCustomer,
    initialValue,
  );

  const [entryPassData, setEntryPassData] = useState<{
    product_id: bigint | null;
    register_date: string;
    valid_until: string;
  }>({
    product_id: null,
    register_date: formaterDate(getCurrentDate(), "shortDate"),
    valid_until: "",
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    startTransition(() => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="name">Nama</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            placeholder="Masukkan nama pelanggan"
            id="name"
            name="name"
            autoComplete="off"
          />
          {state.errors?.name && (
            <ValidationErrorMessage
              errorMessage={state.errors.name.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="national_id_number">NIK</Label>
          <Input
            placeholder="61xxxxxxxxxxxxx"
            name="national_id_number"
            autoComplete="off"
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            minLength={16}
            maxLength={16}
          />
          {state.errors?.national_id_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.national_id_number.toString()}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="phone_number">No Hp</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            placeholder="08xx-xxx-xxx"
            id="phone_number"
            name="phone_number"
            autoComplete="off"
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          {state.errors?.phone_number && (
            <ValidationErrorMessage
              errorMessage={state.errors.phone_number.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="product_id">Tipe</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Select
            value={entryPassData.product_id?.toString()}
            onValueChange={handleProductChange}
            name="product_id"
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
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
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <div>
            <Label htmlFor="registered_at">Tanggal Pendaftaran</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            value={entryPassData.register_date}
            type="date"
            id="registered_at"
            name="registered_at"
            autoComplete="off"
            onChange={handleRegisterDateChange}
            min={formaterDate(getCurrentDate(), "shortDate")}
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
        <div className="col-span-2 space-y-2">
          <Label>Operator</Label>
          <Input disabled value={user.name} autoComplete="off" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" className="bg-qubu_blue">
          Simpan
        </Button>
        <Button variant={"destructive"} asChild>
          <Link href={"/entry-pass"}>Batal</Link>
        </Button>
      </div>
    </form>
  );
}
