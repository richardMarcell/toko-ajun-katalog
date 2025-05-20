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
import { updateStatusLostWristband } from "../_actions/update-status-lost-wristband ";

// Not Used
export default function ModalLostWristband({
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
  const [showModalLostWristband, setShowModalLostWristband] =
    useState<boolean>(false);
  const [showModalConfirmation, setShowModalConfirmation] =
    useState<boolean>(false);
  const [lostWristbandCodes, setLostWristbandCodes] =
    useState<string[]>(wristbandRentedCodes);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRemoveWristbandCode = ({
    wristbandCode,
  }: {
    wristbandCode: string;
  }) => {
    setLostWristbandCodes(
      lostWristbandCodes.filter((code) => code !== wristbandCode),
    );
  };

  const handleCancelLostProcess = () => {
    setErrorMessage("");
    setLostWristbandCodes(wristbandRentedCodes);
  };

  const handleSaveLostWristband = async () => {
    const formData = new FormData();
    formData.append("lost_wristband_codes", JSON.stringify(lostWristbandCodes));

    const response = await updateStatusLostWristband({
      walletId: walletId,
      data: Object.fromEntries(formData.entries()),
    });

    if (response.status) {
      toast(response.message, {
        duration: 2000,
      });
    }

    if (response.status == "success") {
      setShowModalConfirmation(false);
      setLostWristbandCodes([]);
      redirect(response.url as string);
    }
  };

  return (
    <Fragment>
      <Dialog
        open={showModalLostWristband}
        onOpenChange={setShowModalLostWristband}
      >
        <DialogTrigger asChild>
          <Button className="bg-red-500">
            <RectangleEllipsis />
            Gelang Hilang
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[700px] space-y-4">
          <DialogHeader>
            <DialogTitle>CashQ Hilang</DialogTitle>
          </DialogHeader>

          {errorMessage && (
            <ValidationErrorMessage errorMessage={errorMessage} />
          )}

          {isSwimsuitReturned || !isRentSwimsuit ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {lostWristbandCodes.map((returnWristbandCode, index) => (
                  <Chip
                    label={returnWristbandCode}
                    onRemove={() =>
                      handleRemoveWristbandCode({
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
                if (lostWristbandCodes.length > 0) {
                  setErrorMessage("");
                  setShowModalLostWristband(false);
                  setShowModalConfirmation(true);
                } else
                  setErrorMessage(
                    "Tidak ada kode gelang yang dinyatakan hilang",
                  );
              }}
              disabled={!isSwimsuitReturned && isRentSwimsuit}
            >
              Proses
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelLostProcess}>
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
            <DialogTitle>Konfirmasi CashQ Hilang</DialogTitle>
          </DialogHeader>

          <div className="text-center">
            <p>
              Apakah kode CashQ <strong>{lostWristbandCodes.join(", ")}</strong>{" "}
              dinyatakan hilang?
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowModalConfirmation(false);
                setShowModalLostWristband(true);
              }}
            >
              <ScanSearch /> Cek Kembali
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancelLostProcess}>
                <X /> Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-qubu_checker_light_green"
              onClickCapture={handleSaveLostWristband}
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
