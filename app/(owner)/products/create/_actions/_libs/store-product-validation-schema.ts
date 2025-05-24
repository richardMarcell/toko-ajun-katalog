import { db } from "@/db";
import { productCategories, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

export const storeProductValidationSchema = yup.object({
  name: yup
    .string()
    .required("Nama produk wajib diisi")
    .typeError("Nama produk wajib diisi dengan karakter yang valid"),
  code: yup
    .string()
    .required("Kode produk wajib diisi")
    .typeError("Kode produk wajib diisi dengan karakter yang valid")
    .test(
      "is-code-exists",
      "Kode produk sudah terdaftar",
      async function (code) {
        const product = await db.query.products.findFirst({
          where: eq(products.code, code),
        });

        if (product) return false;

        return true;
      },
    ),
  description: yup
    .string()
    .required("Deskripsi produk wajib diisi")
    .typeError("Deskripsi produk wajib diisi dengan karakter yang valid"),
  product_category_id: yup
    .number()
    .required("Kategori produk wajib dipilih")
    .typeError("Kategori produk wajib dipilih dengan pilihan yang valid")
    .test(
      "is-product-category-exists",
      "Kategori produk tidak terdaftar dalam sistem",
      async function (productCategoryId) {
        const productCategory = await db.query.productCategories.findFirst({
          where: eq(productCategories.id, BigInt(productCategoryId)),
        });

        if (!productCategory) return false;

        return true;
      },
    ),
  price: yup
    .number()
    .required("Harga produk wajib dipilih")
    .typeError("Harga produk wajib diisi dengan karakter yang valid")
    .min(500, "Harga produk harus minimal bernilai 500"),
  image: yup
    .mixed<File>()
    .required("Gambar wajib diupload")
    .test("is-uploaded", "Gambar wajib diupload.", (image) => {
      if (!image) return false;
      if (image.size === 0) return false;

      return true;
    })
    .test(
      "is-valid-file",
      "Gambar dikirim dengan format yang tidak valid.",
      (image) => {
        if (!image) return true;
        if (!(image instanceof File)) return false;
        if (image.size === 0) return true;

        return image && image.type.includes("image");
      },
    ),
});
