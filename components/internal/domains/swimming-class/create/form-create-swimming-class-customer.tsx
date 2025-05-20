"use client";

import { storeSwimmingClassCustomer } from "@/app/(main)/swimming-class/create/_actions/store-swimming-class-customer";
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
  formaterDate,
  formatNumberToCurrency,
  getCurrentDate,
} from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Product } from "@/types/domains/swimming-class/general";
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

export function FormCreateSwimmingClassCustomer({
  products,
  user,
}: {
  products: Product[];
  user: User;
}) {
  const [state, formAction] = useActionState(
    storeSwimmingClassCustomer,
    initialValue,
  );
  const [validFor, setValidFor] = useState<number>(0);

  const handleClassTypeInputOnChange = (productId: bigint) => {
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );
    if (selectedProduct) {
      setValidFor(selectedProduct.swimming_class_valid_for ?? 0);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    if (state.status == "success") redirect("/swimming-class");
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
            min={16}
            max={16}
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
            <Label htmlFor="product_id">Tipe Kelas</Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Select
            onValueChange={(productId: string) =>
              handleClassTypeInputOnChange(BigInt(productId))
            }
            name="product_id"
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe kelas" />
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
            defaultValue={formaterDate(getCurrentDate(), "shortDate")}
            type="date"
            id="registered_at"
            name="registered_at"
            autoComplete="off"
            min={formaterDate(getCurrentDate(), "shortDate")}
          />
          {state.errors?.registered_at && (
            <ValidationErrorMessage
              errorMessage={state.errors.registered_at.toString()}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>Berlaku</Label>
          <Input disabled value={`${validFor}x Pertemuan`} autoComplete="off" />
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
          <Link href={"/swimming-class"}>Batal</Link>
        </Button>
      </div>
    </form>
  );
}
