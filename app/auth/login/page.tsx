import { Suspense } from "react";
import { FormLogin } from "./_components/form-login";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const user = await getUserAuthenticated();
  if (user) return redirect("/redirect");

  return (
    <Suspense>
      <div className="flex min-h-screen">
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold">
                Selamat Datang Kembali!
              </h1>
              <p className="text-gray-600">
                Masukkan data diri anda untuk mengakses akun Anda
              </p>
            </div>
            <FormLogin />
            <div className="text-center">
              Belum punya akun? Daftar{" "}
              <Link className="text-blue-600" href={"/auth/register"}>
                disini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
