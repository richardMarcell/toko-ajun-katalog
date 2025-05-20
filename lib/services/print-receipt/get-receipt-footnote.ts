import { getReceiptFootnoteText, ReceiptFootnoteEnum } from "@/lib/enums/ReceiptFootnoteEnum";

export default function getReceiptFootnote({type}:{type: ReceiptFootnoteEnum}): string {
  return getReceiptFootnoteText(type)
}
