import { products, promoSale, sales as salesSchema } from "@/db/schema";
import { PromoTypeEnum } from "@/lib/enums/PromoTypeEnum";
import { SalesStatusEnum } from "@/lib/enums/SalesStatusEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { calculateValueFromPercentage, getCurrentDate } from "@/lib/utils";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import { DatabaseTransaction } from "@/types/db-transaction";
import { Promo } from "@/types/promo";
import { SalesIncludeRelation } from "@/types/sale";
import { eq, inArray } from "drizzle-orm";
import { getUserAuthenticated } from "../auth/get-user-authenticated";
import { applyPromoNominalType } from "./apply-promo-nominal-type";
import { applyPromoPercentageType } from "./apply-promo-percentage-type";
import { getTaxPercent } from "./get-tax-percent";
import { storeSalesDetail } from "./store-sale-detail";
import { db } from "@/db";
import { ProductConfig } from "@/lib/config/product-config";

type SaleDetailProps = {
  product_id: number;
  qty: number;
  price: number;
};

type SalesTemporaryProps = {
  sales_details: SaleDetailProps[];
};

type SaleDetailResponse = {
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

type SalesTemporaryResponse = {
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_gross: number;
  total_net: number;
  grand_total: number;
  sales_details: SaleDetailResponse[];
};

export const promoTypeHandleMap = new Map([
  [
    PromoTypeEnum.NOMINAL,
    (promo: Promo, salesTemporary: SalesTemporaryResponse) =>
      applyPromoNominalType(promo, salesTemporary),
  ],
  [
    PromoTypeEnum.PERCENTAGE,
    (promo: Promo, salesTemporary: SalesTemporaryResponse) =>
      applyPromoPercentageType(promo, salesTemporary),
  ],
]);

export async function proccessSalesTransaction({
  tx,
  salesTemporary,
  sateliteConfig,
  transactionType,
  promoCode,
}: {
  tx: DatabaseTransaction;
  salesTemporary: SalesTemporaryProps;
  sateliteConfig: {
    unit_business: UnitBusinessSateliteQubuEnum;
    warehouse_id: string;
  };
  transactionType: SalesTransactionTypeEnum;
  promoCode?: string | null;
}): Promise<SalesIncludeRelation> {
  // Recompose sales data by retrieving the latest product prices and tax requirements from the database
  const recomposeSalesTemporary =
    await getRecomposeSalesTemporary(salesTemporary);

  // Apply promo (if any) to the recomposed sales data
  const salesTemporaryDiscounted = await getSalesTemporaryDiscounted(
    recomposeSalesTemporary,
    promoCode,
  );

  // Add tax calculations to the discounted sales data based on the business unit's tax configuration
  const salesTemporaryWithTax = await getSalesTemporaryWithTax(
    salesTemporaryDiscounted,
    sateliteConfig.unit_business,
  );

  // Store sales temporary with tax to database
  const salesId = await storeSales({
    salesTemporary: salesTemporaryWithTax,
    transactionType: transactionType,
    tx: tx,
    unitBusiness: sateliteConfig.unit_business,
  });

  // Store sales detail to database
  await storeSalesDetail({
    salesId,
    salesDetails: salesTemporaryWithTax.sales_details,
    sateliteConfig: sateliteConfig,
    tx: tx,
  });

  const sales = await tx.query.sales.findFirst({
    where: eq(salesSchema.id, salesId),
    with: {
      salesDetails: {
        with: {
          product: true,
        },
      },
    },
  });
  if (!sales) throw new Error("Sales doesn't exsist");

  // Store data to the promo_sale table if a promo is applied to this sale
  await storePromoSale({
    sales,
    promoCode,
    tx,
  });

  return sales;
}

export async function getRecomposeSalesTemporary(
  salesTemporary: SalesTemporaryProps,
): Promise<SalesTemporaryResponse> {
  const productIds = salesTemporary.sales_details.map((detail) =>
    BigInt(detail.product_id),
  );

  const productList = await db
    .select({
      id: products.id,
      price: products.price,
      is_required_tax: products.is_required_tax,
      is_discountable: products.is_discountable,
    })
    .from(products)
    .where(inArray(products.id, productIds));

  const productPriceMap = new Map<
    number,
    {
      id: bigint;
      price: number;
      is_required_tax: boolean;
      is_discountable: boolean;
    }
  >();

  for (const product of productList) {
    productPriceMap.set(Number(product.id), {
      id: product.id,
      price: Number(product.price),
      is_required_tax: product.is_required_tax,
      is_discountable: product.is_discountable,
    });
  }

  const updatedSalesDetails = salesTemporary.sales_details.map((detail) => {
    const isSpecialItem =
      BigInt(detail.product_id) === ProductConfig.special_item.id;
    const isTopUpProduct =
      BigInt(detail.product_id) === ProductConfig.top_up.id;

    const price =
      isSpecialItem || isTopUpProduct
        ? detail.price
        : (productPriceMap.get(detail.product_id)?.price ?? 0);

    const isRequiredTax =
      productPriceMap.get(detail.product_id)?.is_required_tax ?? true;
    const isDiscountable =
      productPriceMap.get(detail.product_id)?.is_discountable ?? true;

    const subtotal = detail.qty * detail.price;
    return {
      ...detail,
      product_id: detail.product_id,
      qty: detail.qty,
      price: price,
      subtotal: subtotal,
      discount_percent_sale: 0,
      discount_percent_detail: 0,
      discount_amount_sale: 0,
      discount_amount_detail: 0,
      total_net: subtotal,
      tax_percent: 0,
      tax_amount: 0,
      total_final: subtotal,
      is_required_tax: isRequiredTax,
      is_discountable: isDiscountable,
    };
  });

  const totalGross = updatedSalesDetails.reduce(
    (sum, d) => sum + d.subtotal,
    0,
  );

  return {
    sales_details: updatedSalesDetails,
    discount_amount: 0,
    discount_percent: 0,
    tax_amount: 0,
    tax_percent: 0,
    grand_total: totalGross,
    total_gross: totalGross,
    total_net: totalGross,
  };
}

export async function getSalesTemporaryDiscounted(
  salesTemporary: SalesTemporaryResponse,
  promoCode?: string | null,
): Promise<SalesTemporaryResponse> {
  let salesTemporaryDiscounted = salesTemporary;

  if (promoCode) {
    const { promo } = await getValidPromo(promoCode);

    if (!promo) return salesTemporaryDiscounted;

    const promoHandler = promoTypeHandleMap.get(promo.type as PromoTypeEnum);
    if (!promoHandler) throw new Error("Unsupported promo type");

    salesTemporaryDiscounted = promoHandler(promo, salesTemporary);
  }

  return salesTemporaryDiscounted;
}

export async function getSalesTemporaryWithTax(
  salesTemporary: SalesTemporaryResponse,
  unitBusiness: UnitBusinessSateliteQubuEnum,
): Promise<SalesTemporaryResponse> {
  const taxPercent = await getTaxPercent(unitBusiness);

  const updatedSalesDetails = salesTemporary.sales_details.map((detail) => {
    const isRequiredTax = detail.is_required_tax;
    const taxAmount = isRequiredTax
      ? Math.ceil(calculateValueFromPercentage(detail.total_net, taxPercent))
      : 0;
    const totalFinal = detail.total_final + taxAmount;
    return {
      ...detail,
      tax_percent: isRequiredTax ? taxPercent : 0,
      tax_amount: taxAmount,
      total_final: totalFinal,
    };
  });

  const grandTotal = updatedSalesDetails.reduce(
    (sum, detail) => sum + detail.total_final,
    0,
  );
  const totalTaxAmount = updatedSalesDetails.reduce(
    (sum, detail) => sum + detail.tax_amount,
    0,
  );

  return {
    ...salesTemporary,
    sales_details: updatedSalesDetails,
    tax_percent: taxPercent,
    tax_amount: totalTaxAmount,
    grand_total: grandTotal,
  };
}

async function storeSales({
  salesTemporary,
  unitBusiness,
  transactionType,
  tx,
}: {
  salesTemporary: SalesTemporaryResponse;
  unitBusiness: UnitBusinessSateliteQubuEnum;
  transactionType: SalesTransactionTypeEnum;
  tx: DatabaseTransaction;
}): Promise<bigint> {
  const user = await getUserAuthenticated();
  if (!user) throw new Error("User doesn't authenticated");

  const dataSalesToInsert: typeof salesSchema.$inferInsert = {
    discount_amount: salesTemporary.discount_amount.toString(),
    discount_percent: salesTemporary.discount_percent,
    tax_amount: salesTemporary.tax_amount.toString(),
    tax_percent: salesTemporary.tax_percent,
    code: getTransactionCode(unitBusiness),
    grand_total: salesTemporary.grand_total.toString(),
    total_net: salesTemporary.total_net.toString(),
    total_gross: salesTemporary.total_gross.toString(),
    unit_business: unitBusiness,
    sales_status: SalesStatusEnum.CLOSED,
    transaction_type: transactionType,
    created_by: BigInt(user.id),
  };

  const salesCreated = await tx
    .insert(salesSchema)
    .values(dataSalesToInsert)
    .$returningId();
  const salesId = salesCreated[0].id;

  return salesId;
}

function getTransactionCode(
  unitBusiness: UnitBusinessSateliteQubuEnum,
): string {
  const today = getCurrentDate().toISOString().split("T")[0];
  const timestampt = Date.now();
  let transactionCode = "";

  switch (unitBusiness) {
    case UnitBusinessSateliteQubuEnum.DIMSUM:
      transactionCode = `DS/${today}/${timestampt}`;
      break;
    case UnitBusinessSateliteQubuEnum.FOOD_CORNER:
      transactionCode = `FC/${today}/${timestampt}`;
      break;
    case UnitBusinessSateliteQubuEnum.SOUVENIR:
      transactionCode = `SOU/${today}/${timestampt}`;
      break;
    case UnitBusinessSateliteQubuEnum.LOCKER:
      transactionCode = `LOCK/${today}/${timestampt}`;
      break;
    case UnitBusinessSateliteQubuEnum.RESTO_PATIO:
      transactionCode = `RP/${today}/${timestampt}`;
      break;
    case UnitBusinessSateliteQubuEnum.WATER_PARK_TICKET:
      transactionCode = `WP/${today}/${timestampt}`;
      break;
    default:
      transactionCode = `-`;
      break;
  }

  return transactionCode;
}

async function storePromoSale({
  sales,
  promoCode,
  tx,
}: {
  sales: SalesIncludeRelation;
  promoCode?: string | null;
  tx: DatabaseTransaction;
}): Promise<void> {
  if (promoCode) {
    const { promo } = await getValidPromo(promoCode);

    if (promo) {
      await tx.insert(promoSale).values({
        discount_amount: sales.discount_amount,
        promo_id: promo.id,
        sales_id: sales.id,
      });
    }
  }
}
