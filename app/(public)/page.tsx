"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BadgePercent, Boxes, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col-reverse items-center justify-between gap-8 bg-[#204B4E] px-6 py-12 md:h-[calc(100vh)] md:flex-row md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex w-full flex-col justify-center space-y-6 text-white xl:w-1/2"
        >
          <h1 className="text-center text-4xl font-extrabold leading-snug sm:text-5xl lg:text-6xl xl:text-left">
            Belanja Bahan Pokok Harian di{" "}
            <span className="text-[#C4E980]">Toko Kelontong Terlengkap</span>
          </h1>
          <p className="text-center text-sm leading-relaxed sm:text-lg xl:text-left">
            Temukan kebutuhan rumah tangga Anda mulai dari sembako, peralatan
            mandi, makanan ringan, hingga minuman segar. Toko kelontong kami
            siap memenuhi kebutuhan harian Anda dengan harga terjangkau dan
            pelayanan cepat.
          </p>
          <div className="flex justify-center xl:justify-start">
            <Button
              asChild
              className="bg-[#C4E980] p-6 text-xl font-bold text-[#204B4E] hover:bg-[#D3EDA4]"
            >
              <Link href={"/order"}>Mulai Belanja Sekarang</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="hidden w-full md:w-1/2 xl:block"
        >
          <Image
            src="/hero-section.png"
            alt="Belanja kebutuhan harian"
            width={600}
            height={600}
            className="mx-auto h-auto w-full object-contain"
            priority
          />
        </motion.div>
      </section>

      <section className="bg-[#F5FFF8] px-6 py-12 md:px-12">
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <h2 className="text-3xl font-bold text-[#204B4E]">
            Kenapa Belanja di Toko Kami?
          </h2>
          <p className="text-gray-600">
            Kami menyediakan kebutuhan rumah tangga lengkap dengan layanan
            terbaik.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#E0F2E9] bg-white p-6 shadow transition hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D3EDA4]">
                <BadgePercent className="text-[#204B4E]" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#204B4E]">
                Harga Terjangkau
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Belanja hemat untuk kebutuhan sehari-hari tanpa menguras dompet.
              </p>
            </div>
            <div className="rounded-xl border border-[#E0F2E9] bg-white p-6 shadow transition hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D3EDA4]">
                <Boxes className="text-[#204B4E]" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#204B4E]">
                Produk Lengkap
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Dari sembako hingga alat kebersihan tersedia lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#204B4E] px-6 py-12 text-center text-white md:px-12">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C4E980]">
              <ShoppingCart className="text-[#204B4E]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">
            Belanja kebutuhan pokok online kini lebih mudah!
          </h2>
          <p className="text-lg">
            Gabung bersama ratusan pelanggan yang sudah menikmati layanan cepat
            & hemat dari toko kami.
          </p>
          <Button
            asChild
            className="mt-4 bg-[#C4E980] px-8 py-4 text-[#204B4E] hover:bg-[#D3EDA4]"
          >
            <Link href={"/order"}>Mulai Belanja Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
