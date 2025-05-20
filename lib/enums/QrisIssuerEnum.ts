export enum QrisIssuerEnum {
  GOPAY = "GOPAY",
  OVO = "OVO",
  BCA = "BCA",
  BRI = "BRI",
  MANDIRI = "MANDIRI",
  DANA = "DANA",
}

export function getQrisIssuerCase(issuer: QrisIssuerEnum): string {
  let qrisIssuer = "";

  switch (issuer) {
    case QrisIssuerEnum.GOPAY:
      qrisIssuer = "Gopay";
      break;
    case QrisIssuerEnum.OVO:
      qrisIssuer = "Ovo";
      break;
    case QrisIssuerEnum.BCA:
      qrisIssuer = "BCA";
      break;
    case QrisIssuerEnum.BRI:
      qrisIssuer = "BRI";
      break;
    case QrisIssuerEnum.MANDIRI:
      qrisIssuer = "Mandiri";
      break;
    case QrisIssuerEnum.DANA:
      qrisIssuer = "Dana";
      break;
    default:
      qrisIssuer = "-";
      break;
  }

  return qrisIssuer;
}
