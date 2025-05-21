import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductCategory } from "@/types/product-category";
import { Edit } from "lucide-react";
import Link from "next/link";

export function TableListProductCategories({
  productCategories,
  offset,
}: {
  productCategories: ProductCategory[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Name</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productCategories.map((productCategory, index) => (
          <TableRow key={productCategory.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{productCategory.name}</TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/product-categories/${productCategory.id}/edit`}>
                    <Edit />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar kategori produk Toko Ajun</TableCaption>
    </Table>
  );
}
