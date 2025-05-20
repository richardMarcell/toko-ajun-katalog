import { calculateValueFromPercentage } from "@/lib/utils";
import { Promo } from "@/types/promo";

type SaleDetail = {
  product_id: number;
  is_required_tax: boolean;
  is_discountable: boolean;
  qty: number;
  price: number;
  subtotal: number;
  discount_percent_sale: number;
  discount_percent_detail: number;
  discount_amount_sale: number;
  discount_amount_detail: number;
  total_net: number;
  tax_percent: number;
  tax_amount: number;
  total_final: number;
};

type SalesTemporary = {
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_gross: number;
  total_net: number;
  grand_total: number;
  sales_details: SaleDetail[];
};

export function applyPromoPercentageType(
  promo: Promo,
  salesTemporary: SalesTemporary,
): SalesTemporary {
  const totalGross = salesTemporary.sales_details.reduce(
    (sum, detail) => sum + detail.qty * detail.price,
    0,
  );

  const updatedSalesDetails = salesTemporary.sales_details.map((detail) => {
    const isDiscountable = detail.is_discountable;
    const subtotal = detail.qty * detail.price;
    const discountPercent = isDiscountable ? promo.percentage : 0;
    const discountAmount = isDiscountable
      ? calculateValueFromPercentage(subtotal, discountPercent)
      : 0;
    const totalNet = subtotal - discountAmount;

    return {
      ...detail,
      subtotal: subtotal,
      discount_percent_sale: discountPercent,
      discount_percent_detail: 0,
      discount_amount_sale: discountAmount,
      discount_amount_detail: 0,
      total_net: totalNet,
      total_final: totalNet,
    };
  });

  const totalDiscountAmount = updatedSalesDetails.reduce(
    (sum, detail) =>
      sum + detail.discount_amount_sale + detail.discount_amount_detail,
    0,
  );

  const totalDiscountPercent = Number(
    ((totalDiscountAmount / totalGross) * 100).toFixed(2),
  );

  const salesTemporaryDiscounted = {
    ...salesTemporary,
    discount_percent: totalDiscountPercent,
    discount_amount: totalDiscountAmount,
    tax_percent: 0,
    tax_amount: 0,
    total_gross: totalGross,
    total_net: totalGross - totalDiscountAmount,
    grand_total: totalGross - totalDiscountAmount,
    sales_details: updatedSalesDetails,
  };

  return salesTemporaryDiscounted;
}
