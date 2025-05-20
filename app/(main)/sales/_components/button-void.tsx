"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Ban } from "lucide-react";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import voidTransactions from "../_actions/void-transactions";

export default function ButtonVoid({
  saleId,
  isDisabled,
}: {
  saleId: bigint;
  isDisabled: boolean;
}) {
  const [state, formAction] = useActionState(voidTransactions, initialValue);
  const [userAccessCode, setUserAccessCode] = useState<string>("");

  const handleVoid = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("sale_id", saleId.toString());

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-qubu_red font-semibold" disabled={isDisabled}>
          <Ban />
          Void
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Void Transaksi</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan membatalkan transaksi penjualan berikut. Tindakan ini akan
            mencatat transaksi sebagai void dan seluruh stok akan dikembalikan.
            Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleVoid}>
          <div className="pb-6">
            <div className="space-y-2">
              <div>
                <Label htmlFor="access_code">Kode Akses User</Label>
                <span className="text-qubu_red">*</span>
              </div>
              <Input
                placeholder="Masukkan kode akses user"
                id="access_code"
                name="access_code"
                value={userAccessCode}
                autoComplete="off"
                onChange={(event) => setUserAccessCode(event.target.value)}
              />
              {state.errors?.access_code && (
                <ValidationErrorMessage
                  errorMessage={state.errors.access_code.toString()}
                />
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserAccessCode("")}>
              Cancel
            </AlertDialogCancel>
            <Button type="submit" variant={"destructive"}>
              <span>Void</span>
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
