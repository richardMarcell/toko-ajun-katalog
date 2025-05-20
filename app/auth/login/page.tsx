import { Suspense } from "react";
import { FormLogin } from "./_components/form-login";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserAuthenticated();
  if (user) return redirect('/home');

  return (
    <Suspense>
      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Selamat Datang!</h1>
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
