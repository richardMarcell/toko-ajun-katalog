export enum WristbandStatusEnum {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN USE",
  LOST_DAMAGED = "LOST DAMAGED",
}

export function getWristbandStatusCase(type: WristbandStatusEnum): string {
  let wristbandStatus = "";

  switch (type) {
    case WristbandStatusEnum.AVAILABLE:
      wristbandStatus = "Available";
      break;
    case WristbandStatusEnum.IN_USE:
      wristbandStatus = "In use";
      break;
    case WristbandStatusEnum.LOST_DAMAGED:
      wristbandStatus = "Lost/Damaged";
      break;
    default:
      wristbandStatus = "-";
      break;
  }

  return wristbandStatus;
}
