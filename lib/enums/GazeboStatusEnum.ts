export enum GazeboStatusEnum {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN USE",
  UNAVAILABLE = "UNAVAILABLE",
}

export function getGazeboStatusCase(type: GazeboStatusEnum): string {
  let gazeboStatus = "";

  switch (type) {
    case GazeboStatusEnum.AVAILABLE:
      gazeboStatus = "Available";
      break;
    case GazeboStatusEnum.IN_USE:
      gazeboStatus = "In use";
      break;
    case GazeboStatusEnum.UNAVAILABLE:
      gazeboStatus = "Unavailable";
      break;
    default:
      gazeboStatus = "-";
      break;
  }

  return gazeboStatus;
}
