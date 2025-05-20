import { calculateValueFromPercentage } from "@/lib/utils";

type SaleDetail = {
  qty: number;
  price: number;
};

type SalesSummaryProps = {
  salesDetails: SaleDetail[];
  discountAmount: number;
  taxPercent: number;
};

type SalesSummaryResponse = {
  total_gross: number;
  total_net: number;
  tax_amount: number;
  grand_total: number;
};

export function calculateSalesSummary({
  salesDetails,
  discountAmount,
  taxPercent,
}: SalesSummaryProps): SalesSummaryResponse {
  const totalGross = salesDetails.reduce(
    (subtotal, detail) => subtotal + detail.qty * Number(detail.price),
    0,
  );

  const totalNetRaw = totalGross - discountAmount;
  const totalNet = Math.max(totalNetRaw, 0);

  const taxAmount = calculateValueFromPercentage(totalNet, taxPercent);

  const grandTotal = totalNet + taxAmount;

  return {
    total_gross: totalGross,
    total_net: totalNet,
    grand_total: grandTotal,
    tax_amount: taxAmount,
  };
}
