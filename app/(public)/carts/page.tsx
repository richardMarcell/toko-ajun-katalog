import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { formatNumberToCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertDialogDestroyCart } from "./_components/alert-dialog-destroy-cart";
import { getCarts } from "./_repositories/get-carts";
import { AlertDialogStoreSales } from "./_components/alert-dialog-store-sales";

export default async function CartPage() {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.SALES_CREATE],
    user: user,
  });

  const { carts } = await getCarts(user.id);

  const total = carts.reduce((acc, item) => acc + Number(item.subtotal), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Keranjang Belanja</h1>

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/order">Kembali</Link>
        </Button>

        <Button className="bg-green-600" asChild>
          <Link href="/order-list">List Pesanan Anda</Link>
        </Button>
      </div>

      {carts.length === 0 ? (
        <p className="text-center text-xl font-medium italic text-gray-500">
          Keranjang Anda kosong.
        </p>
      ) : (
        <div className="space-y-4">
          {carts.map((cart) => (
            <div
              key={cart.id.toString()}
              className="flex flex-col items-start gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <Image
                src={`${cart.product.image}`}
                alt={cart.product.name}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold">{cart.product.name}</h2>
                  <AlertDialogDestroyCart cart={cart} />
                </div>
                <p className="mb-1 text-sm text-gray-500">
                  {cart.note || "Tanpa catatan"}
                </p>
                <p className="text-sm text-gray-700">
                  Harga: Rp {Number(cart.price).toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-700">Jumlah: {cart.qty}</p>
                <p className="text-sm font-semibold text-gray-800">
                  Subtotal: Rp {Number(cart.subtotal).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <AlertDialogStoreSales user={user} />
          </div>

          <div className="mt-6 flex justify-end">
            <div className="text-lg font-bold">
              Total: {formatNumberToCurrency(total)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
