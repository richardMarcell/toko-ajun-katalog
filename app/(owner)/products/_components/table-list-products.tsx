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
import { Product } from "@/types/product";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TableListProducts({
  products,
  offset,
  urlLocal,
}: {
  products: Product[];
  offset: number;
  urlLocal: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[320px]">Name</TableHead>
          <TableHead className="">Kode</TableHead>
          <TableHead className="">Deskripsi</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Image
                src={`${urlLocal}/${product.image}`}
                alt={product.name}
                width={100}
                height={100}
                loading="lazy"
                className="object-cover"
              />
              <div>{product.name}</div>
            </TableCell>
            <TableCell>{product.code}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>
              <div className="flex gap-4">
                <Button
                  variant="transparent"
                  className="m-0 p-0 text-green-600"
                  asChild
                >
                  <Link href={`/products/${product.id}/edit`}>
                    <Edit />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar produk Toko Ajun</TableCaption>
    </Table>
  );
}
