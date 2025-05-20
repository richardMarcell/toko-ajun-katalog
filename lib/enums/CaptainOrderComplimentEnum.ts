export enum CaptainOrderComplimentEnum {
  NONE = "NONE",
  MARKETING = "MARKETING",
}

export function getCaptainOrderComplimentCase(
  captainOrderCompliment: CaptainOrderComplimentEnum,
): string {
  let compliment = "";

  switch (captainOrderCompliment) {
    case CaptainOrderComplimentEnum.NONE:
      compliment = "None";
      break;
    case CaptainOrderComplimentEnum.MARKETING:
      compliment = "Marketing";
      break;
    default:
      compliment = "-";
      break;
  }

  return compliment;
}
