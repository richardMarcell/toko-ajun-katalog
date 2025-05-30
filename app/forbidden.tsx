import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="p-8 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-red-600" />
      <h2 className="mb-2 text-2xl font-bold">Akses Ditolak</h2>
      <p className="mb-4 text-gray-600">
        Maaf, Anda tidak memiliki izin untuk melakukan tindakan ini.
      </p>
      <Button className="bg-blue-600" asChild>
        <Link href="/">Kembali</Link>
      </Button>
    </div>
  );
}
