"use client";

import InputMoney from "@/components/internal/InputMoney";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPromoTypeCase, PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { formaterDate, getCurrentDate } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { redirect } from "next/navigation";
import {
  BaseSyntheticEvent,
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import storePromo from "../create/_actions/store-promo";

type PromoInput = {
  code: string;
  name: string;
  short_description: string;
  type: string;
  percentage: number;
  amount: number;
  is_required_booklet: boolean;
  periode_start: string;
  periode_end: string;
  unit_businesses: string[];
};

export default function FormCreatePromo() {
  const [promoInput, setPromoInput] = useState<PromoInput>({
    code: "",
    name: "",
    short_description: "",
    type: "",
    is_required_booklet: false,
    amount: 0,
    percentage: 0,
    periode_end: formaterDate(getCurrentDate(), "shortDate"),
    periode_start: formaterDate(getCurrentDate(), "shortDate"),
    unit_businesses: [],
  });
  const [state, formAction] = useActionState(storePromo, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("code", promoInput.code);
      formData.set("name", promoInput.name);
      formData.set("short_description", promoInput.short_description);
      formData.set("type", promoInput.type);
      formData.set("percentage", promoInput.percentage.toString());
      formData.set("amount", promoInput.amount.toString());
      formData.set(
        "is_required_booklet",
        promoInput.is_required_booklet.toString(),
      );
      formData.set("periode_start", promoInput.periode_start);
      formData.set("periode_end", promoInput.periode_end);
      formData.set(
        "unit_businesses",
        JSON.stringify(promoInput.unit_businesses),
      );
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
        <Label htmlFor="code">Kode Promo</Label>
        <Input
          id="code"
          autoComplete="off"
          placeholder="Masukkan kode promo"
          value={promoInput.code}
          onChange={(e: BaseSyntheticEvent) =>
            setPromoInput({
              ...promoInput,
              code: e.target.value,
            })
          }
        />
        {state?.errors?.code && (
          <ValidationErrorMessage errorMessage={state.errors.code.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          autoComplete="off"
          placeholder="Masukkan nama promo"
          value={promoInput.name}
          onChange={(e: BaseSyntheticEvent) =>
            setPromoInput({
              ...promoInput,
              name: e.target.value,
            })
          }
        />
        {state?.errors?.name && (
          <ValidationErrorMessage errorMessage={state.errors.name.toString()} />
        )}
      </div>
      <div>
        <Label htmlFor="short_description">Deskripsi Singkat</Label>
        <Textarea
          id="short_description"
          autoComplete="off"
          placeholder="Masukkan nama promo"
          value={promoInput.short_description}
          onChange={(e: BaseSyntheticEvent) =>
            setPromoInput({
              ...promoInput,
              short_description: e.target.value,
            })
          }
        />
        {state?.errors?.short_description && (
          <ValidationErrorMessage
            errorMessage={state.errors.short_description.toString()}
          />
        )}
      </div>
      <div>
        <Label htmlFor="type">Tipe Promo</Label>
        <Select
          value={promoInput.type}
          onValueChange={(promoType) =>
            setPromoInput({
              ...promoInput,
              type: promoType,
              amount: 0,
              percentage: 0,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe promo" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PromoTypeEnum).map((type) => {
              return (
                <SelectItem key={type} value={type}>
                  {getPromoTypeCase(type)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {state?.errors?.type && (
          <ValidationErrorMessage errorMessage={state.errors.type.toString()} />
        )}
      </div>

      {promoInput.type === PromoTypeEnum.PERCENTAGE && (
        <div>
          <Label htmlFor="percentage">Persentase</Label>
          <Input
            id="percentage"
            type="number"
            autoComplete="off"
            value={promoInput.percentage}
            onChange={(e: BaseSyntheticEvent) =>
              setPromoInput({
                ...promoInput,
                percentage: e.target.value,
              })
            }
            min={0}
            max={100}
          />
          {state?.errors?.percentage && (
            <ValidationErrorMessage
              errorMessage={state.errors.percentage.toString()}
            />
          )}
        </div>
      )}

      {promoInput.type === PromoTypeEnum.NOMINAL && (
        <div>
          <Label htmlFor="amount">Nominal</Label>
          <InputMoney
            id="amount"
            value={promoInput.amount}
            placeholder="Masukkan nominal promo"
            onChange={(amount: number | ChangeEvent<HTMLInputElement>) =>
              setPromoInput({ ...promoInput, amount: Number(amount) })
            }
          />
          {state?.errors?.amount && (
            <ValidationErrorMessage
              errorMessage={state.errors.amount.toString()}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="periode_start">Periode Awal</Label>
          <Input
            id="periode_start"
            type="date"
            autoComplete="off"
            value={promoInput.periode_start}
            min={formaterDate(getCurrentDate(), "shortDate")}
            onChange={(e: BaseSyntheticEvent) =>
              setPromoInput({
                ...promoInput,
                periode_start: e.target.value,
              })
            }
          />
          {state?.errors?.periode_start && (
            <ValidationErrorMessage
              errorMessage={state.errors.periode_start.toString()}
            />
          )}
        </div>
        <div>
          <Label htmlFor="periode_end">Periode Akhir</Label>
          <Input
            id="periode_end"
            type="date"
            autoComplete="off"
            value={promoInput.periode_end}
            min={promoInput.periode_start}
            onChange={(e: BaseSyntheticEvent) =>
              setPromoInput({
                ...promoInput,
                periode_end: e.target.value,
              })
            }
          />
          {state?.errors?.periode_end && (
            <ValidationErrorMessage
              errorMessage={state.errors.periode_end.toString()}
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="unit_businesses">Unit Bisnis</Label>
        <MultiSelectUnitBusiness
          promoInput={promoInput}
          setPromoInput={setPromoInput}
        />
        {state?.errors?.unit_businesses && (
          <ValidationErrorMessage
            errorMessage={state.errors.unit_businesses.toString()}
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_required_booklet"
          onCheckedChange={(isRequiredBooklet: boolean) =>
            setPromoInput({
              ...promoInput,
              is_required_booklet: isRequiredBooklet,
            })
          }
        />
        <Label
          htmlFor="is_required_booklet"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Wajib menggunakan booklet?
        </Label>
        {state?.errors?.is_required_booklet && (
          <ValidationErrorMessage
            errorMessage={state.errors.is_required_booklet.toString()}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button className="bg-qubu_green" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}

function MultiSelectUnitBusiness({
  setPromoInput,
  promoInput,
}: {
  setPromoInput: Dispatch<SetStateAction<PromoInput>>;
  promoInput: PromoInput;
}) {
  return (
    <MultiSelect
      options={Object.values(UnitBusinessSateliteQubuEnum).map(
        (unitBusiness) => ({
          label: getDisplayUnitBusinessSatelite(unitBusiness),
          value: unitBusiness,
        }),
      )}
      onValueChange={(unitBusinesses) =>
        setPromoInput({ ...promoInput, unit_businesses: unitBusinesses })
      }
    />
  );
}
