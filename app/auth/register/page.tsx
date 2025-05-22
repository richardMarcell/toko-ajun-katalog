import Link from "next/link";
import { FormRegister } from "./_components/form-register";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold">Selamat Datang!</h1>
            <p className="text-gray-600">
              Silahkan daftarkan diri Anda pada Aplikasi Kami
            </p>
          </div>

          <FormRegister />

          <div className="text-center">
            Sudah punya akun? Klik{" "}
            <Link className="text-blue-600" href={"/auth/login"}>
              disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
