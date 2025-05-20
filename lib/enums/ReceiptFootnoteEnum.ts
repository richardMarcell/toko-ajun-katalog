import { formaterDate, getCurrentDate } from "../utils";

export enum ReceiptFootnoteEnum {
  I_ACKNOWLEDGE_AND_AGREE = "I ACKNOWLEDGE AND AGREE",
  SYARAT_DAN_PERATURAN_BERLAKU = "SYARAT DAN PERATURAN BERLAKU",
}

export function getReceiptFootnoteText(type: ReceiptFootnoteEnum): string {
  let receiptFootNote = "";

  switch (type) {
    case ReceiptFootnoteEnum.I_ACKNOWLEDGE_AND_AGREE:
      receiptFootNote =
        "I acknowledge and agree that\nINSURANCE COVERAGE IS UP TO 60 YEARS OLD. Certain accident risk\nnot guaranteed Children under 12 y/o is not permitted to enter\nwithout supervision. Swimwear is compulsory in water facility.\nNo food and drink from outside. No drug or\nweapon/dangerous subtance";
      break;
    case ReceiptFootnoteEnum.SYARAT_DAN_PERATURAN_BERLAKU:
      const currentDate = formaterDate(getCurrentDate(), "date");
      receiptFootNote = `Syarat dan Peraturan berlaku:\n1. Jika hilang/rusak/dibawa pulang maka penyewa HARUS membayar\ndenda sesuai dengan harga denda per item.\n2. Penyewa harus memberikan KTP/SIM yang berlaku sebagai\njaminan & akan dikembalikan setelah penyewaan selesai.\n3. Bukti Tanda Terima ini berlaku sebagai kontrak sewa/bukti\nyang sah.\n4. Penyewa dianggap menerima peraturan sewa ini saat\nmenandatangani kontrak.\n5. Maksimal batas penyewaan baju renang hanya sampai Pukul 17:00\nWIB waktu setempat\n\nPenyewa\n\n\n${currentDate}`;
      break;
    default:
      receiptFootNote = "-";
      break;
  }

  return receiptFootNote;
}
