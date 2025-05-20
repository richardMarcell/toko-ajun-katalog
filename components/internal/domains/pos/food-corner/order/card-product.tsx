"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import {
  Product,
  ProductQuantityFunctionProps,
} from "@/types/domains/pos/food-corner/sales/order";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { QuantityButtonGroup } from "./quantity-button-group";

export function CardProduct({
  product,
  saleDetailMap,
  addSalesTemporaryItem,
  removeSalesTemporaryItem,
  ...props
}: {
  product: Product;
  saleDetailMap: Map<number, number>;
  addSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
  removeSalesTemporaryItem: (product: ProductQuantityFunctionProps) => void;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className="p-3" {...props}>
      <CardContent className="p-2">
        <div className="flex gap-4">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="aspect-square h-[88px] w-[88px] rounded-lg object-contain p-1"
          />
          <div className="space-y-4">
            <div>
              <h1 className="font-medium">{product.name}</h1>
              <p className="h-18 line-clamp-4 text-xs">{product.description}</p>
            </div>
            {product.stock_qty && (
              <div>
                <p className="w-fit rounded-full py-1 text-sm font-semibold">{`Stok tersedia: ${product.stock_qty}`}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <span className="font-medium">
            {formatNumberToCurrency(Number(product.price))}
          </span>

          <QuantityButtonGroup
            product={product}
            saleDetailMap={saleDetailMap}
            addSalesTemporaryItem={addSalesTemporaryItem}
            removeSalesTemporaryItem={removeSalesTemporaryItem}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// function CardProdukWithCheckBox() {
//   return (
//     <div key={product.id} className="border bg-white p-3 rounded-lg">
//       <input type="checkbox" />
//       <Image
//         src={product.gambar}
//         alt={product.nama}
//         width={200}
//         height={200}
//         className="w-full h-32 object-contain"
//       />
//       <div className="flex flex-col pt-2">
//         <p className="text-qubu_dark_gray font-medium text-sm">
//           {getKategoriProdukCase(product.kategori as KategoriProdukEnum)}
//         </p>
//         <p className="font-medium">{product.nama}</p>
//         <div className="flex justify-between">
//           <p className="font-bold">
//             {formatNumberToCurrency(Number(product.harga_satuan))}
//           </p>
//           <div className="flex gap-2 items-center">
//             <button className="w-4 h-4 p-[10px] rounded-lg flex justify-center items-center border font-bold">
//               {"-"}
//             </button>
//             <div className="w-4 h-4 p-[10px] bg-gray-100 rounded-lg flex justify-center items-center border font-bold">
//               0
//             </div>
//             <button className="w-4 h-4 p-[10px] rounded-lg flex justify-center items-center border font-bold">
//               {"+"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
