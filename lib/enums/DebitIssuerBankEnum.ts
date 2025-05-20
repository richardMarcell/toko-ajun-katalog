export enum DebitIssuerBankEnum {
  BCA = "BCA",
  BRI = "BRI",
  MANDIRI = "MANDIRI",
  BNI = "BNI",
  CIMB_NIAGA = "CIMB_NIAGA",
  BTN = "BTN",
  DANAMON = "DANAMON",
  PERMATA = "PERMATA",
  PANIN = "PANIN",
  MAYBANK = "MAYBANK",
}

export function getDebitIssuerBankCase(issuer: DebitIssuerBankEnum): string {
  switch (issuer) {
    case DebitIssuerBankEnum.BCA:
      return "BCA";
    case DebitIssuerBankEnum.BRI:
      return "BRI";
    case DebitIssuerBankEnum.MANDIRI:
      return "Mandiri";
    case DebitIssuerBankEnum.BNI:
      return "BNI";
    case DebitIssuerBankEnum.CIMB_NIAGA:
      return "CIMB Niaga";
    case DebitIssuerBankEnum.BTN:
      return "BTN";
    case DebitIssuerBankEnum.DANAMON:
      return "Danamon";
    case DebitIssuerBankEnum.PERMATA:
      return "Permata";
    case DebitIssuerBankEnum.PANIN:
      return "Panin";
    case DebitIssuerBankEnum.MAYBANK:
      return "Maybank";
    default:
      return "-";
  }
}
