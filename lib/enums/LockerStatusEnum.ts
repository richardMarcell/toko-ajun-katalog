export enum LockerStatusEnum {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN USE",
  UNAVAILABLE = "UNAVAILABLE",
}

export function getLockerDisplayStatus(type: LockerStatusEnum): string {
  let lockerStatus = "";

  switch (type) {
    case LockerStatusEnum.AVAILABLE:
      lockerStatus = "Available";
      break;
    case LockerStatusEnum.IN_USE:
      lockerStatus = "In use";
      break;
    case LockerStatusEnum.UNAVAILABLE:
      lockerStatus = "Unavailable";
      break;
    default:
      lockerStatus = "-";
      break;
  }

  return lockerStatus;
}
