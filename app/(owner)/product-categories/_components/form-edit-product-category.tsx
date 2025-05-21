"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCategory } from "@/types/product-category";
import { redirect } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import updateProductCategory from "../[productCategoryId]/edit/_actions/update-product-category";
import { initialValue } from "../../../../repositories/initial-value-form-state";

export default function FormEditProductCategory({
  productCategory,
}: {
  productCategory: ProductCategory;
}) {
  const [state, formAction] = useActionState(
    updateProductCategory,
    initialValue,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("product_category_id", productCategory.id.toString());
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status === "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);
  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          defaultValue={productCategory.name}
          id="name"
          autoComplete="off"
          name="name"
          placeholder="Masukkan nama kategori"
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>

      <div className="flex justify-end">
        <Button className="bg-green-600" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}
