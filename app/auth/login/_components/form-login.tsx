"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormInput = {
  username: string;
  password: string;
};

export function FormLogin() {
  const queryParams = useSearchParams();
  const nextAuthCallbackUrl = queryParams.get("callbackUrl");
  const router = useRouter();

  const [formInput, setFormInput] = useState<FormInput>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await signIn("credentials", {
      username: formInput.username,
      password: formInput.password,
      redirect: false,
      callbackUrl: nextAuthCallbackUrl || "/api/store-session",
    });

    if (response?.ok) {
      toast("Berhasil Login", {
        description: "Anda akan diarahkan ke panel Satelite",
        duration: 1000,
      });

      setIsRedirecting(true);
      router.push(response.url as string);
    } else {
      toast("Login gagal", {
        description: "Username atau Password Tidak Terdaftar",
        duration: 1000,
      });
    }

    setIsLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="username"
          value={formInput.username}
          onChange={(e) =>
            setFormInput({ ...formInput, username: e.target.value })
          }
          placeholder="Masukkan username"
          autoComplete="off"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={formInput.password}
          onChange={(e) =>
            setFormInput({ ...formInput, password: e.target.value })
          }
          placeholder="Masukkan password"
          autoComplete="off"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isRedirecting}
        className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 disabled:bg-red-300"
      >
        {isRedirecting ? "Redirecting..." : isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
