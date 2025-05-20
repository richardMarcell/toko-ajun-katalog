import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberToCurrency } from "@/lib/utils";
import { Product } from "@/types/product";

export function TableListProducts({
  products,
  offset,
}: {
  products: Product[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[150px]">Kode</TableHead>
          <TableHead className="w-[300px]">Nama</TableHead>
          <TableHead className="w-[100px]">Harga</TableHead>
          <TableHead>Deskripsi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>{offset + index + 1}</TableCell>
            <TableCell>{product.code}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {formatNumberToCurrency(Number(product.price))}
            </TableCell>
            <TableCell>{product.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>Daftar Produk Satelite Qubu Resort</TableCaption>
    </Table>
  );
}
