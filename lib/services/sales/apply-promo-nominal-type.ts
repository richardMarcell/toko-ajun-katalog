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

export function applyPromoNominalType(
  promo: Promo,
  salesTemporary: SalesTemporary,
): SalesTemporary {
  const totalGross = salesTemporary.sales_details.reduce(
    (sum, detail) => sum + detail.qty * detail.price,
    0,
  );
  const isDiscountAmountExceedsTotalGross = Number(promo.amount) > totalGross;
  const discountAmount = isDiscountAmountExceedsTotalGross
    ? totalGross
    : Number(promo.amount);
  const discountPercent = (discountAmount / totalGross) * 100;

  const lastDiscountableIndex = [...salesTemporary.sales_details]
    .map((detail, index) => (detail.is_discountable && detail.price > 0  ? index : -1))
    .filter((index) => index !== -1)
    .pop();

  let accumulatedDiscountAmountUnit = 0;
  const salesDetails = salesTemporary.sales_details.map((detail, index) => {
    const isDiscountable = detail.is_discountable && detail.price > 0;
    const subtotal = detail.qty * detail.price;
    let discountAmountUnit = isDiscountable
      ? Math.round(calculateValueFromPercentage(subtotal, discountPercent))
      : 0;

    if (isDiscountable) {
      if (index === lastDiscountableIndex) {
        discountAmountUnit = discountAmount - accumulatedDiscountAmountUnit;
      } else {
        accumulatedDiscountAmountUnit += discountAmountUnit;
      }
    }

    const totalNet = subtotal - discountAmountUnit;

    return {
      ...detail,
      subtotal: subtotal,
      discount_percent_sale: isDiscountable ? discountPercent : 0,
      discount_percent_detail: 0,
      discount_amount_sale: discountAmountUnit,
      discount_amount_detail: 0,
      total_net: totalNet,
      total_final: totalNet,
    };
  });

  const totalDiscountAmount = salesDetails.reduce(
    (sum, detail) =>
      sum + detail.discount_amount_sale + detail.discount_amount_detail,
    0,
  );

  const totalDiscountPercent = (totalDiscountAmount / totalGross) * 100;

  const salesTemporaryDiscounted = {
    ...salesTemporary,
    discount_percent: totalDiscountPercent,
    discount_amount: totalDiscountAmount,
    tax_percent: 0,
    tax_amount: 0,
    total_gross: totalGross,
    total_net: totalGross - totalDiscountAmount,
    grand_total: totalGross - totalDiscountAmount,
    sales_details: salesDetails,
  };

  return salesTemporaryDiscounted;
}
