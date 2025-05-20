export enum CaptainOrderOutleEnum {
  PATIO_BISTRO = "PATIO BISTRO",
  ROOM_SERVICES = "ROOM SERVICES",
  DIMSUM = "DIMSUM",
}

export function getCaptainOrderOutletCase(
  retoOutlet: CaptainOrderOutleEnum,
): string {
  let outlet = "";

  switch (retoOutlet) {
    case CaptainOrderOutleEnum.PATIO_BISTRO:
      outlet = "Patio Bistro";
      break;
    case CaptainOrderOutleEnum.ROOM_SERVICES:
      outlet = "Room Services";
      break;
    case CaptainOrderOutleEnum.DIMSUM:
      outlet = "Dimsum";
      break;
    default:
      outlet = "-";
      break;
  }

  return outlet;
}

export function getRestoPatioOutlet(): CaptainOrderOutleEnum[] {
  return [
    CaptainOrderOutleEnum.PATIO_BISTRO,
    CaptainOrderOutleEnum.ROOM_SERVICES,
  ];
}
