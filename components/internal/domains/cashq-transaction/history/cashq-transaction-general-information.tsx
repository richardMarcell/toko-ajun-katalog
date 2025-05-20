import { Label } from "@/components/ui/label";
import { formaterDate } from "@/lib/utils";

export type WalletGeneralInformation = {
  deposit_amount: string;
  customer_name: string;
  customer_phone_number: string;
  created_at: Date;
};

export function CashqTransactionGeneralInformation({
  walletGeneralInformation,
}: {
  walletGeneralInformation: WalletGeneralInformation;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-4">
        <Label className="font-bold text-qubu_dark_gray">CUSTOMER</Label>
        <p className="font-bold">{walletGeneralInformation.customer_name}</p>
      </div>
      <div className="space-y-4">
        <Label className="font-bold text-qubu_dark_gray">DATE</Label>
        <p className="font-bold">
          {formaterDate(walletGeneralInformation.created_at, "date")}
        </p>
      </div>
      <div className="space-y-4">
        <Label className="font-bold text-qubu_dark_gray">PHONE</Label>
        <p className="font-bold">
          {walletGeneralInformation.customer_phone_number}
        </p>
      </div>
    </div>
  );
}
