import { calculateValueFromPercentage } from "@/lib/utils";
import { Promo } from "@/types/promo";
import { calculateSalesSummary } from "./calculate-sales-summary";

type SaleDetail = {
  qty: number;
  price: number;
};

type SalesTemporary = {
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  sales_details: SaleDetail[];
  total_gross: number;
  total_net: number;
  grand_total: number;
};

export function calculatePromoPercentageType<
  TSalesTemporary extends SalesTemporary,
>(promo: Promo, salesTemporary: TSalesTemporary): TSalesTemporary {
  const totalGross = salesTemporary.sales_details.reduce(
    (subtotal, detail) => subtotal + detail.qty * Number(detail.price),
    0,
  );

  const discountPercent = promo.percentage;
  const discountAmount = calculateValueFromPercentage(
    totalGross,
    discountPercent,
  );

  const salesSummaryCalculated = calculateSalesSummary({
    salesDetails: salesTemporary.sales_details,
    discountAmount: discountAmount,
    taxPercent: salesTemporary.tax_percent,
  });

  const salesTemporaryDiscounted = {
    ...salesTemporary,
    discount_percent: discountPercent,
    discount_amount: discountAmount,
    tax_percent: salesTemporary.tax_percent,
    tax_amount: salesSummaryCalculated.tax_amount,
    total_gross: salesSummaryCalculated.total_gross,
    total_net: salesSummaryCalculated.total_net,
    grand_total: salesSummaryCalculated.grand_total,
  };

  return salesTemporaryDiscounted;
}
