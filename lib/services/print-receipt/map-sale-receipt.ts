import { ProductConfig } from "@/lib/config/product-config";
import {
  getDisplayUnitBusinessSatelite,
  UnitBusinessSateliteQubuEnum,
} from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { User } from "@/types/next-auth";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SaleReceipt } from "@/types/sale-receipt";
import { SpecialItemExtras } from "@/types/special-item-extras";

type MapSaleReceipt = Pick<
  Sale,
  | "id"
  | "code"
  | "tax_amount"
  | "total_gross"
  | "discount_amount"
  | "created_at"
  | "grand_total"
  | "unit_business"
  | "print_count"
> & {
  payment_method: string;
  user: Pick<User, "name">;
  salesDetails: Array<
    Pick<SaleDetail, "qty" | "total_final"> & {
      product_id?: bigint;
      extras?: SaleDetail["extras"];
      product: {
        name?: string;
        description?: string;
      };
    }
  >;
};

// TODO: add property isProductNameFromDescription with type boolean
export default function mapSaleReceipt({
  sale,
}: {
  sale: MapSaleReceipt;
}): SaleReceipt {
  return {
    id: Number(sale.id),
    unit_business_name: getDisplayUnitBusinessSatelite(
      sale.unit_business as UnitBusinessSateliteQubuEnum,
    ),
    code: sale.code,
    op: sale.user.name,
    payment_method: sale.payment_method,
    date: sale.created_at,
    total_gross: Number(sale.total_gross),
    discount_amount: Number(sale.discount_amount),
    tax_amount: Number(sale.tax_amount),
    is_print_as_copy: sale.print_count >= 1 ? true : false,
    grand_total: Number(sale.grand_total),
    footnote: "",
    sales_details: sale.salesDetails.map((salesDetail) => {
      const isSpecialItem =
        salesDetail.product_id == ProductConfig.special_item.id;

      const specialItemExtras = salesDetail.extras as SpecialItemExtras;

      const productName = isSpecialItem
        ? (specialItemExtras.name ?? "")
        : (salesDetail.product.name ?? salesDetail.product.description ?? "");
      return {
        item: productName,
        qty: salesDetail.qty,
        total_final: Number(salesDetail.total_final),
      };
    }),
  };
}
