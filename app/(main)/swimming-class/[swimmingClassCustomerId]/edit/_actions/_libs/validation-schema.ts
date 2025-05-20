import { db } from "@/db";
import { getDateStartTime, removeDateTimezone } from "@/lib/utils";
import * as yup from "yup";

const today = removeDateTimezone(getDateStartTime());

export const validationSchema = yup.object({
  swimming_class_customer_id: yup
    .number()
    .required("swimming_class_customer_id wajib disertakan")
    .test({
      name: "is-id-exists",
      skipAbsent: true,
      async test(id) {
        if (!id) return false;

        const swimmingClassCustomer =
          await db.query.swimmingClassCustomers.findFirst({
            where: (swimmingClassCustomers, { eq }) =>
              eq(swimmingClassCustomers.id, BigInt(id)),
          });

        if (!swimmingClassCustomer) return false;

        return true;
      },
      message: "Data Customer dari ID yang Dikirimkan Tidak Ditemukan",
    }),
  name: yup
    .string()
    .typeError("Nama pelanggan wajib diisi dengan karakter yang valid")
    .required("Nama pelanggan wajib diisi"),
  national_id_number: yup
    .string()
    .typeError(
      "Nomor Induk Kependudukan wajib diisi dengan karakter yang valid",
    )
    .nullable()
    .test({
      name: "is-national-id-number-exists",
      skipAbsent: true,
      async test(nationalIdNumber) {
        if (!nationalIdNumber) return true;

        const swimmingClassCustomerId = BigInt(
          this.parent.swimming_class_customer_id,
        );

        const swimmingClassCustomer =
          await db.query.swimmingClassCustomers.findFirst({
            where: (swimmingClassCustomers, { eq, and, not }) =>
              and(
                eq(swimmingClassCustomers.national_id_number, nationalIdNumber),
                not(eq(swimmingClassCustomers.id, swimmingClassCustomerId)),
              ),
          });

        if (!swimmingClassCustomer) return true;

        return false;
      },
      message: "Nomor Induk Kependudukan Sudah Terdaftar",
    })
    .test(
      "is-more-than-or-less-than-16",
      "Nomor Induk Kependudukan tidak boleh lebih atau kurang dari 16 Karakter",
      function (value) {
        if (!value) return true;
        if (value?.length == 16) return true;

        return false;
      },
    ),
  phone_number: yup
    .string()
    .typeError("Nomor Hp wajib diisi dengan karakter yang valid")
    .required("Nomor Hp wajib diisi")
    .test({
      name: "is-phone-number-exists",
      skipAbsent: true,
      async test(phoneNumber) {
        if (!phoneNumber) return true;

        const swimmingClassCustomerId = BigInt(
          this.parent.swimming_class_customer_id,
        );

        const swimmingClassCustomer =
          await db.query.swimmingClassCustomers.findFirst({
            where: (swimmingClassCustomers, { eq, and, not }) =>
              and(
                eq(swimmingClassCustomers.phone_number, phoneNumber),
                not(eq(swimmingClassCustomers.id, swimmingClassCustomerId)),
              ),
          });

        if (
          !swimmingClassCustomer ||
          swimmingClassCustomer.phone_number == phoneNumber
        )
          return true;

        return false;
      },
      message: "Nomor Hp Sudah Terdaftar",
    }),
  product_id: yup
    .string()
    .typeError("Nomor Hp wajib diisi dengan karakter yang valid")
    .required("Tipe Kelas wajib dipilih")
    .test({
      name: "is-product-exists",
      skipAbsent: true,
      async test(productId) {
        if (!productId) return false;

        const product = await db.query.products.findFirst({
          where: (products, { eq }) => eq(products.id, BigInt(productId)),
        });

        if (product) return true;

        return false;
      },
      message:
        "Tipe kelas yang dipilih tidak valid atau tidak terdaftar dalam sistem",
    }),
  registered_at: yup
    .date()
    .typeError("Tanggal pendaftaran wajib diisi dengan format yang valid")
    .min(today, "Tanggal pendaftaran tidak boleh kurang dari hari ini")
    .required("Tanggal pendaftaran wajib diisi"),
});
