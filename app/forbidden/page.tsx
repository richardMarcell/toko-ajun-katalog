import { AlertTriangle } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="p-8 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-qubu_red" />
      <h2 className="mb-2 text-2xl font-bold">Akses Ditolak</h2>
      <p className="mb-4 text-gray-600">
        Maaf, Anda tidak memiliki izin untuk mengakses aplikasi ini.
      </p>
    </div>
  );
}
