"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { InputHTMLAttributes, useRef, useState } from "react";
import { toast } from "sonner";

type InputImageUploadProps = InputHTMLAttributes<HTMLInputElement> & {
  initialImage?: string | null;
  imagePreviewSize?: {
    width: number;
    height: number;
  };
  acceptExtensions?: string[];
};

export default function InputImageUpload({
  initialImage = null,
  imagePreviewSize = {
    width: 800,
    height: 800,
  },
  acceptExtensions = [],
  ...props
}: InputImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { width, height } = imagePreviewSize;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        resetFileInput();
        toast("Tipe Gambar Tidak Valid", {
          description: "Silakan unggah gambar dalam bentuk png, jpg, jpeg.",
          duration: 3000,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        resetFileInput();
        toast("Kesalahan Gambar Terlalu Besar", {
          description: "Ukuran gambar harus kurang dari 5MB.",
          duration: 3000,
        });
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        accept={
          acceptExtensions.length > 0
            ? acceptExtensions.map((ext) => `.${ext}`).join(",")
            : "image/*"
        }
        {...props}
        type="file"
        onChange={handleImageUpload}
      />
      {imagePreview && (
        <div className="flex items-center justify-start">
          <Image
            loading="lazy"
            src={imagePreview}
            width={width}
            height={height}
            alt="Image Preview"
            className="mt-4 rounded-lg border p-4 duration-300 hover:bg-blue-50"
          />
        </div>
      )}
    </>
  );
}
