"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockerStatusEnum } from "@/lib/enums/LockerStatusEnum";
import {
  getLockerDisplayType,
  LockerTypeEnum,
} from "@/lib/enums/LockerTypeEnum";
import { cn } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { Product } from "@/types/product";
import { ArrowLeft, ArrowLeftRight, Plus } from "lucide-react";
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
import updateLockerWallet from "../_actions/update-locker-wallet";
import FormAddWristband from "./FormAddWristband";
import FormChangeWristband from "./FormChangeWristband";

export default function FormSelectLocker({
  wallet,
  lockerList,
  lockerRent,
  walletId,
  wristbandProduct,
}: {
  wallet: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    code: string | null;
    customer_name: string;
    customer_phone_number: string;
    deposit_payment_method: string | null;
    deposit_amount: string;
    saldo: string;
    status: string;
    lockerWallets: {
      id: bigint;
      created_at: Date;
      updated_at: Date | null;
      wallet_id: bigint;
      status: string | null;
      locker_id: bigint | null;
      type: string;
      payment_status: string | null;
    }[];
  };
  lockerList: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    status: string;
    label: string;
    type: string;
  }[];
  lockerRent: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    wallet_id: bigint;
    status: string | null;
    locker_id: bigint | null;
    type: string;
    payment_status: string | null;
    locker: {
      id: bigint;
      created_at: Date;
      updated_at: Date | null;
      status: string;
      label: string;
      type: string;
    } | null;
  };
  walletId: string;
  wristbandProduct: Product | null;
}) {
  const [state, formAction] = useActionState(updateLockerWallet, initialValue);
  const [selectedLockerIds, setSelectedLockerIds] = useState<
    { locker_id: number; locker_label: string }[]
  >(
    lockerRent.locker
      ? [
          {
            locker_id: Number(lockerRent.locker.id),
            locker_label: lockerRent.locker.label,
          },
        ]
      : [],
  );
  const [isButtonTukarGelangClicked, setIsButtonTukarGelangClicked] =
    useState<boolean>(false);
  const [isButtonTambahGelangClicked, setIsButtonTambahGelangClicked] =
    useState<boolean>(false);

  const isInOtherFormActions =
    isButtonTukarGelangClicked || isButtonTambahGelangClicked;

  // NOTE: acc = accumulator
  const lockerWalletAvailable = wallet.lockerWallets.reduce<{
    [key: string]: number;
  }>(
    (acc, lockerWallet) => {
      acc[lockerWallet.type] = (acc[lockerWallet.type] || 0) + 1;
      return acc;
    },
    { FAMILY: 0, STANDARD: 0 },
  );

  const lockerWalletHaveLocker = wallet.lockerWallets.reduce<{
    [key: string]: number;
  }>(
    (acc, lockerWallet) => {
      // Check if locker_id is not null
      if (lockerWallet.locker_id !== null) {
        acc[lockerWallet.type] = (acc[lockerWallet.type] || 0) + 1;
      }
      return acc;
    },
    { FAMILY: 0, STANDARD: 0 },
  );

  const toggleSelectedLocker = (locker: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    status: string;
    label: string;
    type: string;
  }) => {
    const lockerId = Number(locker.id);

    const isSelected = selectedLockerIds.some(
      (selectedLocker) => selectedLocker.locker_id === lockerId,
    );

    setSelectedLockerIds((prevSelectedLockerIds) => {
      if (isSelected) {
        return prevSelectedLockerIds.filter(
          (selectedLocker) => selectedLocker.locker_id !== lockerId,
        );
      }

      return prevSelectedLockerIds.length < 1
        ? [
            ...prevSelectedLockerIds,
            { locker_id: lockerId, locker_label: locker.label },
          ]
        : prevSelectedLockerIds;
    });
  };

  const onSubmitLockerId = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("wallet_id", walletId);
      formData.set("locker_wallet_id", lockerRent.id.toString());
      formData.set(
        "locker_ids",
        JSON.stringify(selectedLockerIds.map((locker) => locker.locker_id)),
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

    if (state.status == "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);

  return (
    <div className="flex gap-6">
      {/* Locker */}
      <div className="w-[40%] space-y-6">
        {lockerList.length === 0 ? (
          <div className="w-full py-12">
            <p className="text-center text-2xl font-extralight text-gray-400">
              No Locker Available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-2">
            {lockerList.map((locker) => {
              const isLockerSelected = selectedLockerIds.some(
                (selectedLocker) =>
                  selectedLocker.locker_id === Number(locker.id),
              );
              return (
                <Button
                  key={locker.id}
                  className={cn(
                    "text-md h-10 w-10 rounded-md border p-2 text-center text-black hover:border-qubu_vivid_blue/50 hover:bg-qubu_vivid_blue/50 hover:text-white",
                    isLockerSelected
                      ? "border-none bg-qubu_vivid_blue text-white"
                      : "bg-white",
                  )}
                  disabled={
                    (locker.status === LockerStatusEnum.IN_USE &&
                      !selectedLockerIds.some(
                        ({ locker_id }) => locker_id === Number(locker.id),
                      )) ||
                    isInOtherFormActions
                  }
                  onClick={() => toggleSelectedLocker(locker)}
                >
                  {locker.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-[60%] space-y-6">
        <div>
          <div>
            <Label htmlFor="locker_type">Tipe Locker</Label>
          </div>
          <Input
            id="locker_type"
            name="locker_type"
            value={getLockerDisplayType(lockerRent.type as LockerTypeEnum)}
            autoComplete="off"
            disabled
          />
        </div>

        <div>
          <table>
            <tbody>
              <tr>
                <td className="w-28">Standar Loker</td>
                <td className="w-4">:</td>
                <td>{`${lockerWalletHaveLocker[LockerTypeEnum.STANDARD]} / ${lockerWalletAvailable[LockerTypeEnum.STANDARD]}`}</td>
              </tr>
              <tr>
                <td>Family Loker</td>
                <td>:</td>
                <td>{`${lockerWalletHaveLocker[LockerTypeEnum.FAMILY]} / ${lockerWalletAvailable[LockerTypeEnum.FAMILY]}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div>
            <Label htmlFor="locker_label">No. Loker</Label>
          </div>
          <form onSubmit={onSubmitLockerId}>
            <div className="flex justify-between">
              <p className="w-20 text-2xl">
                {selectedLockerIds
                  .map((locker) => locker.locker_label)
                  .join(", ")}
              </p>
              <Button
                className="bg-qubu_green"
                type="submit"
                disabled={isInOtherFormActions}
              >
                Equip
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              className="w-full bg-qubu_red"
              disabled={isButtonTambahGelangClicked}
              onClick={() => setIsButtonTukarGelangClicked(true)}
            >
              <ArrowLeftRight />
              Tukar Gelang
            </Button>
            <Button
              className="w-full bg-qubu_orange"
              disabled={isButtonTukarGelangClicked}
              onClick={() => setIsButtonTambahGelangClicked(true)}
            >
              <Plus />
              Tambah Gelang
            </Button>
          </div>

          {isButtonTukarGelangClicked && (
            <FormChangeWristband
              walletId={walletId}
              setIsButtonTukarGelangClicked={setIsButtonTukarGelangClicked}
            />
          )}

          {isButtonTambahGelangClicked && wristbandProduct && (
            <FormAddWristband
              walletId={walletId}
              lockerWalletId={lockerRent.id.toString()}
              setIsButtonTambahGelangClicked={setIsButtonTambahGelangClicked}
              wristbandProduct={wristbandProduct}
            />
          )}

          {isInOtherFormActions ? (
            <Button className="w-full" disabled>
              <span className="flex items-center gap-2">
                <ArrowLeft /> Kembali
              </span>
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link
                href={`/cashq-transaction/${walletId}/locker-rent`}
                className="flex items-center gap-2"
              >
                <ArrowLeft /> Kembali
                {/* {lockerRent.locker_id === null
                  ? "Kembali"
                  : "Kembali tanpa ada perubahan"} */}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
