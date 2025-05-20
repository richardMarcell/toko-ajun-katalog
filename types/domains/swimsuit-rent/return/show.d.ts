import { Product } from "@/types/product";
import { Sale } from "@/types/sale";
import { SaleDetail } from "@/types/sale-detail";
import { SalesSwimsuitRent } from "@/types/sales-swimsuit-rent";
import { SwimsuitRentWallet } from "@/types/swimsuit-rent-wallet";

export type SaleIncludeRelations = Sale & {
  salesDetails: (SaleDetail & {
    swimsuitRentWallet: SwimsuitRentWallet | null;
    product: Product;
  })[];
  salesSwimsuitRent: SalesSwimsuitRent | null;
};
