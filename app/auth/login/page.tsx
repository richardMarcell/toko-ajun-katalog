import { Suspense } from "react";
import { FormLogin } from "./_components/form-login";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserAuthenticated();
  if (user) return redirect("/redirect");

  return (
    <Suspense>
      <div className="flex min-h-screen">
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold">Selamat Datang!</h1>
              <p className="text-gray-600">
                Masukkan data diri anda untuk mengakses akun Anda
              </p>
            </div>
            <FormLogin />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
