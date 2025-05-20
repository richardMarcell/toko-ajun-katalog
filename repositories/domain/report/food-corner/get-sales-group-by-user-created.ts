import { db } from "@/db";
import { sales } from "@/db/schema";
import { PaymentMethodEnum } from "@/lib/enums/PaymentMethodEnum";
import { SalesTransactionTypeEnum } from "@/lib/enums/SalesTransactionType";
import { eq } from "drizzle-orm";

type SalesItem = {
  sales_date: Date;
  payment_method: string;
  code: string;
  grand_total: number;
};

type SaleDetailsItem = {
  product_name: string;
  image: string;
  qty: number;
  unit_price: number;
  subtotal: number;
};

type GroupedResult = {
  created_by: bigint;
  user_name: string;
  total_cashq: number;
  total_tunai: number;
  total_non_tunai: number;
  sales: SalesItem[];
  saleDetails: SaleDetailsItem[];
};

export default async function getSalesGroupByUserCreated(): Promise<GroupedResult[]> {
  const salesFoodCorner = await db.query.sales.findMany({
    columns: {
      created_by: true,
      code: true,
      grand_total: true,
      created_at: true,
    },
    with: {
      user: {
        columns: {
          name: true,
        },
      },
      payments: {
        columns: {
          payment_method: true,
          total_payment: true,
        },
      },
      salesDetails: {
        with: {
          product: { columns: { name: true, price: true, image: true } },
        },
        columns: {
          qty: true,
          subtotal: true,
        },
      },
    },
    where: eq(
      sales.transaction_type,
      SalesTransactionTypeEnum.FOOD_CORNER_SALE,
    ),
  });

  const grouped = salesFoodCorner.reduce(
    (acc, sale) => {
      const key = sale.created_by.toString();

      if (!acc[key]) {
        acc[key] = {
          created_by: sale.created_by,
          user_name: sale.user.name,
          total_cashq: 0,
          total_tunai: 0,
          total_non_tunai: 0,
          sales: [],
          saleDetails: [],
        };
      }

      for (const payment of sale.payments) {
        const amount = parseFloat(payment.total_payment);

        if (payment.payment_method === PaymentMethodEnum.CASH_Q) {
          acc[key].total_cashq += amount;
        } else if (payment.payment_method === PaymentMethodEnum.TUNAI) {
          acc[key].total_tunai += amount;
        } else {
          acc[key].total_non_tunai += amount;
        }

        acc[key].sales.push({
          sales_date: sale.created_at,
          payment_method: payment.payment_method,
          code: sale.code,
          grand_total: amount,
        });
      }

      for (const saleDetail of sale.salesDetails || []) {
        const productName = saleDetail.product.name;
        const existing = acc[key].saleDetails.find(
          (d) => d.product_name === productName,
        );

        const qty = saleDetail.qty ?? 0;
        const unitPrice = parseFloat(saleDetail.product.price);
        const subtotal = parseFloat(saleDetail.subtotal);

        if (existing) {
          existing.qty += qty;
          existing.subtotal += subtotal;
        } else {
          acc[key].saleDetails.push({
            product_name: productName,
            image: saleDetail.product.image,
            qty,
            unit_price: unitPrice,
            subtotal,
          });
        }
      }

      return acc;
    },
    {} as Record<string, GroupedResult>,
  );

  return Object.values(grouped);
}
