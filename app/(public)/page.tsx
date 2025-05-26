"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
            <Button className="w-fit bg-[#C4E980] px-6 py-6 text-sm font-semibold text-[#204B4E] hover:bg-[#D3EDA4] sm:text-base">
              Belanja Sekarang
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
    </div>
  );
}
