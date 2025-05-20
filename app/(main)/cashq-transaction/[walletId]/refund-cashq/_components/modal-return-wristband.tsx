"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { ServerActionResponse } from "@/types/domains/server-action";
import {
  Check,
  CircleHelp,
  RectangleEllipsis,
  ScanSearch,
  X,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { updateStatusReturnWristband } from "../_actions/update-status-return-wristband";

export default function ModalReturnWristband({
  walletId,
  wristbandRentedCodes,
  isRentSwimsuit,
  isSwimsuitReturned,
}: {
  walletId: bigint;
  wristbandRentedCodes: string[];
  isRentSwimsuit: boolean;
  isSwimsuitReturned: boolean;
}) {
  const [showModalReturnWristband, setShowModalReturnWristband] =
    useState<boolean>(false);
  const [showModalConfirmation, setShowModalConfirmation] =
    useState<boolean>(false);
  const [returnWristbandCodes, setReturnWristbandCodes] = useState<string[]>(
    [],
  );
  const [state, setState] = useState<ServerActionResponse>(initialValue);

  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleTambahReturnWristbandCode = () => {
    const isWristbandRented = wristbandRentedCodes.includes(inputValue);

    if (!inputValue || !isWristbandRented) {
      setErrorMessage(
        "Kode CashQ tidak terdaftar sebagai peminjaman untuk transaksi CashQ berikut",
      );
      return;
    }
    setReturnWristbandCodes((prev) => {
      // NOTE: check if inputValue already exists in prev array
      return prev.includes(inputValue) ? prev : [...prev, inputValue];
    });
    setInputValue("");
  };

  const handleRemoveReturnWristbandCode = ({
    wristbandCode,
  }: {
    wristbandCode: string;
  }) => {
    setReturnWristbandCodes(
      returnWristbandCodes.filter((code) => code !== wristbandCode),
    );
  };

  const handleCancelReturnProcess = () => {
    setInputValue("");
    setReturnWristbandCodes([]);
  };

  const handleSaveReturnWristband = async () => {
    const formData = new FormData();
    formData.append(
      "return_wristband_codes",
      JSON.stringify(returnWristbandCodes),
    );

    const response = await updateStatusReturnWristband({
      walletId: walletId,
      data: Object.fromEntries(formData.entries()),
    });

    setState(response);

    if (response.status) {
      toast(response.message, {
        duration: 2000,
      });
    }

    if (response.status == "success") {
      setShowModalConfirmation(false);
      setReturnWristbandCodes([]);
      redirect(response.url as string);
    }
  };

  return (
    <Fragment>
      <Dialog
        open={showModalReturnWristband}
        onOpenChange={setShowModalReturnWristband}
      >
        <DialogTrigger asChild>
          <Button>
            <RectangleEllipsis />
            Return Gelang
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[700px] space-y-4">
          <DialogHeader>
            <DialogTitle>Return CashQ</DialogTitle>
          </DialogHeader>

          {isSwimsuitReturned || !isRentSwimsuit ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor={"return_wristband_code"}>CashQ Code</Label>
                <div className="flex gap-2">
                  <div className="w-full">
                    <Input
                      placeholder="Scan/Tap Gelang"
                      id={"return_wristband_code"}
                      name={"return_wristband_code"}
                      autoComplete="off"
                      value={inputValue}
                      onChange={(event) => {
                        setErrorMessage("");
                        setInputValue(event.target.value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleTambahReturnWristbandCode();
                        }
                      }}
                    />
                    {state.errors?.return_wristband_code && (
                      <ValidationErrorMessage
                        errorMessage={state.errors.return_wristband_code.toString()}
                      />
                    )}
                    {errorMessage && (
                      <ValidationErrorMessage errorMessage={errorMessage} />
                    )}
                  </div>
                  <Button
                    className="bg-qubu_vivid_blue text-white"
                    onClick={handleTambahReturnWristbandCode}
                  >
                    Tambah
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {returnWristbandCodes.map((returnWristbandCode, index) => (
                  <Chip
                    label={returnWristbandCode}
                    onRemove={() =>
                      handleRemoveReturnWristbandCode({
                        wristbandCode: returnWristbandCode,
                      })
                    }
                    key={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>Pastikan semua baju renang telah dikembaliakn</p>
          )}

          <DialogFooter className="sm:justify-start">
            <Button
              className="bg-qubu_checker_light_green text-white"
              onClick={() => {
                if (returnWristbandCodes.length > 0) {
                  setShowModalReturnWristband(false);
                  setShowModalConfirmation(true);
                } else
                  setErrorMessage(
                    "Tidak ada CashQ yang dikembalikan. Silahkan scan CashQ",
                  );
              }}
              disabled={!isSwimsuitReturned && isRentSwimsuit}
            >
              Proses
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelReturnProcess}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showModalConfirmation}
        onOpenChange={setShowModalConfirmation}
      >
        <DialogContent className="max-w-[700px] space-y-4">
          <DialogHeader className="flex-row justify-center gap-x-4">
            <CircleHelp />
            <DialogTitle>Konfirmasi Pengembalian</DialogTitle>
          </DialogHeader>

          <div className="text-center">
            {returnWristbandCodes.length === 0 ? (
              <p>Apakah benar tidak ada CashQ yang dikembalikan?</p>
            ) : (
              <p>
                Apakah kode CashQ{" "}
                <strong>{returnWristbandCodes.join(", ")}</strong> yang ingin
                dikembalikan sudah benar?
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowModalConfirmation(false);
                setShowModalReturnWristband(true);
              }}
            >
              <ScanSearch /> Cek Kembali
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelReturnProcess}>
                <X /> Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-qubu_checker_light_green"
              onClickCapture={handleSaveReturnWristband}
            >
              <Check /> Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

type ChipProps = {
  label: string;
  onRemove?: () => void;
};

function Chip({ label, onRemove }: ChipProps) {
  return (
    <div className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center rounded-full bg-transparent p-0 text-blue-700 hover:text-blue-900"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
