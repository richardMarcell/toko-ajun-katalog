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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getWalletWristbandReturnDisplayStatus,
  WalletWristbandReturnStatusEnum,
} from "@/lib/enums/WalletWristbandReturnStatusEnum";
import { formaterDate } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { ServerActionResponse } from "@/types/domains/server-action";
import { CirclePlus } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import refundWristbandDepositLostOrDamaged from "../_actions/refund-wristband-deposit-lost-or-damaged";
import scanUserAccessCode from "../_actions/scan-user-access-code";
import scanUserPassword from "../_actions/scan-user-password";

export default function ModalReturnLostWristband({
  walletId,
  walletWristbandsRentedList,
}: {
  walletId: bigint;
  walletWristbandsRentedList: {
    id: bigint;
    created_at: Date;
    return_status: string;
    wristband_code: string;
  }[];
}) {
  const [showModalUserAccessCode, setShowModalUserAccessCode] =
    useState<boolean>(false);
  const [showModalUserPassword, setShowModalUserPassword] =
    useState<boolean>(false);
  const [showModalReturnLostWristband, setShowModalReturnLostWristband] =
    useState<boolean>(false);

  const [state, setState] = useState<ServerActionResponse>(initialValue);
  const [userAccessCode, setUserAccessCode] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");

  const handleScanUserAccessCode = async () => {
    const responseScanUserAccessCode = await scanUserAccessCode({
      userAccessCode: userAccessCode,
    });

    setState(responseScanUserAccessCode);

    if (responseScanUserAccessCode.status) {
      toast(responseScanUserAccessCode.message, {
        duration: 2000,
      });
    }

    if (responseScanUserAccessCode.status == "success") {
      setShowModalUserAccessCode(false);
      setShowModalUserPassword(true);
    }
  };

  const handleScanUserPassword = async () => {
    const responseScanUserPassword = await scanUserPassword({
      userPassword: userPassword,
    });

    setState(responseScanUserPassword);

    if (responseScanUserPassword.status) {
      toast(responseScanUserPassword.message, {
        duration: 2000,
      });
    }

    if (responseScanUserPassword.status == "success") {
      setShowModalUserPassword(false);
      setShowModalReturnLostWristband(true);
    }
  };

  const handleReturnManualGelangRusak = async ({
    wristbandCode,
  }: {
    wristbandCode: string;
  }) => {
    const response = await refundWristbandDepositLostOrDamaged({
      walletId: walletId,
      wristbandCode,
    });

    setState(response);

    if (response.status) {
      toast(response.message, {
        duration: 2000,
      });
    }

    if (response.status == "success" && response.url) redirect(response.url);
  };

  const handleSelesai = async () => {
    setUserAccessCode("");
    setUserPassword("");
    setShowModalReturnLostWristband(false);
  };

  return (
    <Fragment>
      {/* Modal User Access Code */}
      <AlertDialog
        open={showModalUserAccessCode}
        onOpenChange={setShowModalUserAccessCode}
      >
        <AlertDialogTrigger asChild>
          <Button>
            <CirclePlus /> Retur Manual Gelang Rusak
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Retur Manual Gelang Rusak
            </AlertDialogTitle>
            <AlertDialogDescription>
              Pengembalian manual gelang rusak ini akan mengembalikan deposit
              gelang yang rusak. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
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
            <Button onClick={handleScanUserAccessCode}>
              <span>Scan</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal User Password */}
      <AlertDialog
        open={showModalUserPassword}
        onOpenChange={setShowModalUserPassword}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Retur Manual Gelang Rusak
            </AlertDialogTitle>
            <AlertDialogDescription>
              Pengembalian manual gelang rusak ini akan mengembalikan deposit
              gelang yang rusak. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-6">
            <div className="space-y-2">
              <div>
                <Label htmlFor="password">Password User</Label>
                <span className="text-qubu_red">*</span>
              </div>
              <Input
                placeholder="Masukkan password user"
                id="password"
                name="password"
                value={userPassword}
                autoComplete="off"
                onChange={(event) => setUserPassword(event.target.value)}
              />
              {state.errors?.password && (
                <ValidationErrorMessage
                  errorMessage={state.errors.password.toString()}
                />
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setUserPassword("");
                setShowModalUserPassword(false);
                setShowModalUserAccessCode(true);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleScanUserPassword}>
              <span>Scan</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showModalReturnLostWristband}
        onOpenChange={setShowModalReturnLostWristband}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Retur Manual Gelang Rusak
            </AlertDialogTitle>
            <AlertDialogDescription>
              Silahkan pilih gelang yang ingin dinyatakan kembali
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-6">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="font-bold text-black">#</TableHead>
                  <TableHead className="font-bold text-black">
                    Tanggal & Waktu
                  </TableHead>
                  <TableHead className="font-bold text-black">Gelang</TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                  <TableHead className="text-center font-bold text-black">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletWristbandsRentedList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-lg italic text-black"
                    >
                      Tidak ada gelang yang hilang atau rusak
                    </TableCell>
                  </TableRow>
                ) : (
                  walletWristbandsRentedList.map((walletWristband, index) => (
                    <TableRow key={walletWristband.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {formaterDate(walletWristband.created_at, "dateTime")}
                      </TableCell>
                      <TableCell>{walletWristband.wristband_code}</TableCell>
                      <TableCell>
                        {getWalletWristbandReturnDisplayStatus(
                          walletWristband.return_status as WalletWristbandReturnStatusEnum,
                        )}
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <Button
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() =>
                            handleReturnManualGelangRusak({
                              wristbandCode: walletWristband.wristband_code,
                            })
                          }
                        >
                          Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowModalReturnLostWristband(false);
                setShowModalUserPassword(true);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleSelesai}>Selesai</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
