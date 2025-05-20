import { db } from "@/db";
import * as yup from "yup";

export const updateGeneralDataValidationSchema = yup.object({
  entry_pass_customer_id: yup
    .number()
    .required("entry_pass_customer_id wajib disertakan")
    .test({
      name: "is-id-exists",
      skipAbsent: true,
      async test(id) {
        if (!id) return false;

        const entryPassCustomer = await db.query.entryPassCustomers.findFirst({
          where: (entryPassCustomers, { eq }) =>
            eq(entryPassCustomers.id, BigInt(id)),
        });

        if (!entryPassCustomer) return false;

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

        const entryPassCustomerId = BigInt(this.parent.entry_pass_customer_id);

        const entryPassCustomer = await db.query.entryPassCustomers.findFirst({
          where: (entryPassCustomers, { eq, and, not }) =>
            and(
              eq(entryPassCustomers.national_id_number, nationalIdNumber),
              not(eq(entryPassCustomers.id, entryPassCustomerId)),
            ),
        });

        if (!entryPassCustomer) return true;

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

        const entryPassCustomerId = BigInt(this.parent.entry_pass_customer_id);

        const entryPassCustomer = await db.query.entryPassCustomers.findFirst({
          where: (entryPassCustomers, { eq, and, not }) =>
            and(
              eq(entryPassCustomers.phone_number, phoneNumber),
              not(eq(entryPassCustomers.id, entryPassCustomerId)),
            ),
        });

        if (!entryPassCustomer) return true;

        return false;
      },
      message: "Nomor Hp Sudah Terdaftar",
    }),
});
