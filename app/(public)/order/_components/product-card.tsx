import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { formatNumberToCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition hover:border-[#C4E980] hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-4"
        />
      </div>

      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold text-[#204B4E]">{product.name}</h3>
        <p className="line-clamp-2 min-h-[2.75rem] text-sm">
          {product.description}
        </p>
        <p className="text-base font-bold text-[#3B5D5F]">
          {formatNumberToCurrency(Number(product.price))}
        </p>
      </div>

      <div className="absolute bottom-4 right-4">
        <Button className="flex items-center gap-2 bg-[#C4E980] px-4 py-2 text-xs font-semibold text-[#204B4E] hover:bg-[#D3EDA4]">
          <ShoppingCart size={16} />
          Tambah
        </Button>
      </div>
    </div>
  );
}
