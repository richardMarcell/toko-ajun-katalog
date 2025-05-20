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
import { SalesTemporary } from "@/types/domains/tickets/sales/general";
import { Ban } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function ButtonDeleteTicketSalesTemporary({
  ticketSalesTemporary,
}: {
  ticketSalesTemporary: SalesTemporary;
}) {
  const handleCancel = () => {
    if (sessionStorage.getItem("ticket-sales-temporary"))
      sessionStorage.removeItem("ticket-sales-temporary");

    toast("Berhasil melakukan pembatalan dan menghapus transaksi", {
      duration: 2000,
    });

    redirect("/tickets/order");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"destructive"}
          className="flex items-center justify-center gap-2"
        >
          <Ban />
          <span>Batal & Hapus Transaksi</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembatalan Transaksi</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan membatalkan transaksi atas nama{" "}
            <strong>{ticketSalesTemporary.customer_name}</strong>. Tindakan ini
            akan menghapus seluruh data terkait transaksi ini dan tidak dapat
            dikembalikan. Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleCancel} type="button" variant={"destructive"}>
            <span>Batal & Hapus Transaksi</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
