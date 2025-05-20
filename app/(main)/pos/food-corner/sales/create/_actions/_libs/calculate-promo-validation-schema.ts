import { OrderTypeEnum } from "@/lib/enums/OrderTypeEnum";
import { getValidPromo } from "@/repositories/domain/general/get-valid-promo";
import * as yup from "yup";

export const calculatePromoValidationSchema = yup.object({
  sales_temporary: yup.object({
    discount_amount: yup
      .number()
      .typeError("Jumlah diskon wajib diisi dengan angka yang valid")
      .required("Jumlah diskon wajib diisi"),
    discount_percent: yup
      .number()
      .typeError("Persen diskon wajib diisi dengan angka yang valid")
      .required("Persen diskon wajib diisi"),
    tax_amount: yup
      .number()
      .typeError("Jumlah pajak wajib diisi dengan angka yang valid")
      .required("Jumlah pajak wajib diisi"),
    tax_percent: yup
      .number()
      .typeError("Persen pajak wajib diisi dengan angka yang valid")
      .required("Persen pajak wajib diisi"),
    table_number: yup
      .string()
      .typeError("Nomor meja wajib dipilih dengan pilihan yang valid")
      .test(
        "is-required",
        "Nomor meja wajib dipilih ketika tipe pesanan adalah DINE IN",
        function (value) {
          const orderType = this.parent.order_type;

          if (orderType === OrderTypeEnum.DINE_IN) return !!value;

          return true;
        },
      )
      .nullable(),
    order_type: yup
      .string()
      .oneOf(
        ["DINE IN", "TAKE AWAY"],
        "Tipe pesanan yang diterima hanya Dine In dan Take Away",
      )
      .required("Tipe pesanan wajib dipilih"),
    total_net: yup
      .number()
      .typeError("Total penjualan bersih diisi dengan angka yang valid")
      .required("Total penjualan bersih diisi"),
    total_gross: yup
      .number()
      .typeError("Total penjualan kotor wajib diisi dengan angka yang valid")
      .required("Total penjualan kotor wajib diisi"),
    grand_total: yup
      .number()
      .typeError("Total keseluruhan wajib diisi dengan angka yang valid")
      .required("Total keseluruhan wajib diisi"),
    sales_details: yup
      .array()
      .of(
        yup.object().shape({
          product_id: yup
            .number()
            .typeError("Produk wajib dipilih dengan pilihan yang valid")
            .required("Produk wajib diisi"),
          qty: yup
            .number()
            .typeError("Kuantitas wajib diisi dengan angka yang valid")
            .required("Kuantitas wajib diisi"),
          price: yup
            .number()
            .typeError("Harga satuan wajib diisi dengan angka yang valid")
            .required("Harga satuan wajib diisi"),
          note: yup
            .string()
            .typeError("Catatan wajib diisi dengan karakter yang valid")
            .nullable(),
        }),
      )
      .required("Detail penjualan wajib diisi")
      .min(1, "Wajib memilih setidaknya 1 produk untuk dipesan"),
  }),
  promo_code: yup
    .string()
    .typeError("Kode promo wajib diisi dengan karkter yang valid")
    .required("Kode promo wajib diisi")
    .test({
      name: "is-promo-code-exist",
      skipAbsent: true,
      async test(promoCode) {
        const { promo } = await getValidPromo(promoCode);

        if (!promo) return false;
        return true;
      },
      message:
        "Kode promo yang dimasukkan tidak valid atau sudah tidak berlaku, silahkan masukkan kode promo yang lain",
    }),
});
