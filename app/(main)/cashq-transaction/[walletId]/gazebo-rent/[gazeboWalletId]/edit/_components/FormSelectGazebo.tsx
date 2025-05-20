"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import { cn } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { ArrowLeft } from "lucide-react";
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
import updateGazeboWallet from "../_actions/update-gazebo-wallet";

export default function FormSelectGazebo({
  wallet,
  gazeboList,
  gazeboRent,
  walletId,
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
    gazeboWallets: {
      id: bigint;
      created_at: Date;
      updated_at: Date | null;
      wallet_id: bigint;
      status: string | null;
      gazebo_id: bigint | null;
      type: string;
      payment_status: string | null;
    }[];
  };
  gazeboList: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    status: string;
    label: string;
    type: string;
  }[];
  gazeboRent: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    wallet_id: bigint;
    status: string | null;
    gazebo_id: bigint | null;
    type: string;
    payment_status: string | null;
    gazebo: {
      id: bigint;
      created_at: Date;
      updated_at: Date | null;
      status: string;
      label: string;
      type: string;
    } | null;
  };
  walletId: string;
}) {
  const [state, formAction] = useActionState(updateGazeboWallet, initialValue);
  const [selectedGazeboIds, setSelectedGazeboIds] = useState<
    { gazebo_id: number; gazebo_label: string }[]
  >(
    gazeboRent.gazebo
      ? [
          {
            gazebo_id: Number(gazeboRent.gazebo.id),
            gazebo_label: gazeboRent.gazebo.label,
          },
        ]
      : [],
  );

  // NOTE: acc = accumulator
  const gazeboWalletAvailable = wallet.gazeboWallets.reduce<{
    [key: string]: number;
  }>(
    (acc, gazeboWallet) => {
      acc[gazeboWallet.type] = (acc[gazeboWallet.type] || 0) + 1;
      return acc;
    },
    { FAMILY: 0, VIP: 0 },
  );

  const gazeboWalletHaveGazebo = wallet.gazeboWallets.reduce<{
    [key: string]: number;
  }>(
    (acc, gazeboWallet) => {
      // Check if Gazebo_id is not null
      if (gazeboWallet.gazebo_id !== null) {
        acc[gazeboWallet.type] = (acc[gazeboWallet.type] || 0) + 1;
      }
      return acc;
    },
    { FAMILY: 0, VIP: 0 },
  );

  const toggleSelectedGazebo = (gazebo: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    status: string;
    label: string;
    type: string;
  }) => {
    const gazeboId = Number(gazebo.id);

    const isSelected = selectedGazeboIds.some(
      (selectedGazebo) => selectedGazebo.gazebo_id === gazeboId,
    );

    setSelectedGazeboIds((prevSelectedGazeboIds) => {
      if (isSelected) {
        return prevSelectedGazeboIds.filter(
          (selectedGazebo) => selectedGazebo.gazebo_id !== gazeboId,
        );
      }

      return prevSelectedGazeboIds.length < 1
        ? [
            ...prevSelectedGazeboIds,
            { gazebo_id: gazeboId, gazebo_label: gazebo.label },
          ]
        : prevSelectedGazeboIds;
    });
  };

  const onSubmitGazeboId = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("wallet_id", walletId);
      formData.set("gazebo_wallet_id", gazeboRent.id.toString());
      formData.set(
        "gazebo_ids",
        JSON.stringify(selectedGazeboIds.map((gazebo) => gazebo.gazebo_id)),
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
      {/* Gazebo */}
      <div className="w-[40%] space-y-6">
        {gazeboList.length === 0 ? (
          <div className="w-full py-12">
            <p className="text-center text-2xl font-extralight text-gray-400">
              No Gazebo Available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-2">
            {gazeboList.map((gazebo) => {
              const isGazeboSelected = selectedGazeboIds.some(
                (selectedGazebo) =>
                  selectedGazebo.gazebo_id === Number(gazebo.id),
              );
              return (
                <Button
                  key={gazebo.id}
                  className={cn(
                    "text-md h-10 w-10 rounded-md border p-2 text-center text-black hover:border-qubu_vivid_blue/50 hover:bg-qubu_vivid_blue/50 hover:text-white",
                    isGazeboSelected
                      ? "bg-qubu_vivid_blue text-white"
                      : "bg-white",
                  )}
                  disabled={
                    gazebo.status === GazeboStatusEnum.IN_USE &&
                    !selectedGazeboIds.some(
                      ({ gazebo_id }) => gazebo_id === Number(gazebo.id),
                    )
                  }
                  onClick={() => toggleSelectedGazebo(gazebo)}
                >
                  {gazebo.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-[60%] space-y-6">
        <div>
          <div>
            <Label htmlFor="gazebo_type">Tipe Gazebo</Label>
          </div>
          <Input
            id="gazebo_type"
            name="gazebo_type"
            value={getGazeboDisplayType(gazeboRent.type as GazeboTypeEnum)}
            autoComplete="off"
            disabled
          />
        </div>

        <div>
          <table>
            <tbody>
              <tr>
                <td className="w-32">Family Gazebo</td>
                <td className="w-4">:</td>
                <td>{`${gazeboWalletHaveGazebo[GazeboTypeEnum.FAMILY]} / ${gazeboWalletAvailable[GazeboTypeEnum.FAMILY]}`}</td>
              </tr>
              <tr>
                <td>VIP Gazebo</td>
                <td>:</td>
                <td>{`${gazeboWalletHaveGazebo[GazeboTypeEnum.VIP]} / ${gazeboWalletAvailable[GazeboTypeEnum.VIP]}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div>
            <Label htmlFor="gazebo_label">No. Gazebo</Label>
          </div>
          <form onSubmit={onSubmitGazeboId}>
            <div className="flex justify-between">
              <p className="w-20 text-2xl">
                {selectedGazeboIds
                  .map((gazebo) => gazebo.gazebo_label)
                  .join(", ")}
              </p>
              <Button className="bg-qubu_green" type="submit">
                Equip
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-2">
          <Button className="w-full" asChild>
            <Link href={`/cashq-transaction/${walletId}/gazebo-rent`}>
              <ArrowLeft /> Kembali
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
