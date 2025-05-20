"use client";

import InputMoney from "@/components/internal/InputMoney";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Check, Plus, X } from "lucide-react";
import {
  BaseSyntheticEvent,
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { storeSpecialItem } from "../_actions/store-special-item";
import { CaptainOrderIncludeRelationship } from "../_types/edit";

type SpecialItem = {
  name: string;
  qty: number;
  price: number;
  note: string;
};

const initialValueSpecialItem = {
  name: "",
  qty: 0,
  price: 0,
  note: "",
};

export function DialogFormOrderSpecialItem({
  captainOrder,
}: {
  captainOrder: CaptainOrderIncludeRelationship;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [specialItem, setSpecialItem] = useState<SpecialItem>(
    initialValueSpecialItem,
  );

  const [state, formAction] = useActionState(storeSpecialItem, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData();

      formData.set("captain_order_id", captainOrder.id.toString());
      formData.set("name", specialItem.name);
      formData.set("qty", specialItem.qty.toString());
      formData.set("price", specialItem.price.toString());
      formData.set("note", specialItem.note);

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status == "success") {
      setIsOpen(false);
      setSpecialItem(initialValueSpecialItem);
    }
  }, [state]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={captainOrder.is_closed}
          className="flex gap-2 bg-qubu_blue text-white"
        >
          <Plus />
          <span>Item Spesial</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Special Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div>
              <Label htmlFor="name">Nama Item</Label>
              <span className="text-red-500">*</span>
            </div>

            <Input
              type="text"
              placeholder="ex: Telur Dadar"
              id="name"
              value={specialItem.name}
              onChange={(e: BaseSyntheticEvent) =>
                setSpecialItem({
                  ...specialItem,
                  name: e.target.value,
                })
              }
              autoComplete="off"
            />

            {state?.errors?.name && (
              <ValidationErrorMessage
                errorMessage={state.errors.name.toString()}
              />
            )}
          </div>
          <div>
            <div>
              <Label htmlFor="price">Harga</Label>
              <span className="text-red-500">*</span>
            </div>

            <InputMoney
              id="price"
              type="text"
              placeholder="Input harga"
              value={specialItem.price}
              onChange={(value) =>
                setSpecialItem({
                  ...specialItem,
                  price: Number(value),
                })
              }
            />

            {state?.errors?.price && (
              <ValidationErrorMessage
                errorMessage={state.errors.price.toString()}
              />
            )}
          </div>

          <div>
            <div>
              <Label htmlFor="note">Notes</Label>
            </div>

            <Input
              type="text"
              placeholder="Additional note"
              id="note"
              value={specialItem.note}
              onChange={(e: BaseSyntheticEvent) =>
                setSpecialItem({
                  ...specialItem,
                  note: e.target.value,
                })
              }
              autoComplete="off"
            />

            {state?.errors?.note && (
              <ValidationErrorMessage
                errorMessage={state.errors.note.toString()}
              />
            )}
          </div>
          <div>
            <div>
              <Label htmlFor="note">Qty</Label>
              <span className="text-red-500">*</span>
            </div>

            <Input
              type="number"
              placeholder="Input kuantitas produk"
              id="qty"
              value={specialItem.qty}
              onChange={(e: BaseSyntheticEvent) =>
                setSpecialItem({
                  ...specialItem,
                  qty: e.target.value,
                })
              }
              autoComplete="off"
              min={0}
            />

            {state?.errors?.qty && (
              <ValidationErrorMessage
                errorMessage={state.errors.qty.toString()}
              />
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              variant={"secondary"}
            >
              <X />
              <span>Cancel</span>
            </Button>
            <Button type="submit" className="flex gap-2 bg-qubu_blue">
              <Check />
              <span>Simpan</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
