import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <Ghost size={48} className="mx-auto mb-4 text-gray-500" />
      <h2 className="mb-2 text-2xl font-bold">Halaman Tidak Ditemukan</h2>
      <p className="mb-4 text-gray-600">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Button asChild className="bg-blue-600">
        <Link href="/redirect">Kembali</Link>
      </Button>
    </div>
  );
}
