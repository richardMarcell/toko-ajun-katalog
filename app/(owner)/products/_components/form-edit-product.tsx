"use client";

import InputImageUpload from "@/components/internal/InputImageUpload";
import InputMoney from "@/components/internal/InputMoney";
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
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { ProductCategory } from "@/types/product-category";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { initialValue } from "../../../../repositories/initial-value-form-state";
import updateProduct from "../[productId]/edit/_actions/update-product";

export default function FormEditProduct({
  productCategories,
  product,
  urlLocal,
}: {
  productCategories: ProductCategory[];
  product: Product;
  urlLocal: string;
}) {
  const [state, formAction] = useActionState(updateProduct, initialValue);

  const [price, setPrice] = useState<number>(Number(product.price));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("product_id", product.id.toString());
      formData.set("price", price.toString());
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
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Masukkan nama produk"
          defaultValue={product.name}
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="code">Kode</Label>
        <Input
          id="code"
          name="code"
          autoComplete="off"
          placeholder="Masukkan kode produk"
          defaultValue={product.code}
        />
        {state?.errors?.code && (
          <ValidationErrorMessage errorMessage={state.errors.code.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          autoComplete="off"
          placeholder="Masukkan deskripsi produk"
          defaultValue={product.description}
        />
        {state?.errors?.description && (
          <ValidationErrorMessage
            errorMessage={state.errors.description.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="product_category_id">Kategori Produk</Label>
        <Select
          name="product_category_id"
          defaultValue={product.product_category_id.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori produk" />
          </SelectTrigger>
          <SelectContent>
            {productCategories.map((productCategory) => {
              return (
                <SelectItem
                  key={productCategory.id}
                  value={productCategory.id.toString()}
                >
                  {productCategory.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {state?.errors?.product_category_id && (
          <ValidationErrorMessage
            errorMessage={state.errors.product_category_id.toString()}
          />
        )}
      </div>

      <div>
        <Label htmlFor="price">Harga</Label>
        <InputMoney
          id="price"
          name="price"
          autoComplete="off"
          placeholder="Masukkan harga produk"
          onChange={(value) => setPrice(Number(value))}
          value={price}
        />
        {state?.errors?.price && (
          <ValidationErrorMessage
            errorMessage={state.errors.price.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="image">Gambar</Label>
        <InputImageUpload
          initialImage={`${urlLocal}/${product.image}`}
          id="image"
          name="image"
          autoComplete="off"
        />
        {state?.errors?.image && (
          <ValidationErrorMessage
            errorMessage={state.errors.image.toString()}
          />
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
