import { foodCorner1Permissions } from "../ip-location-permissions/food-corner-1-permissions";
import { foodCorner2Permissions } from "../ip-location-permissions/food-corner-2-permissions";
import { foodCorner3Permissions } from "../ip-location-permissions/food-corner-3-permissions";
import { itSupport1Permissions } from "../ip-location-permissions/it-support-permissionsts";
import { locker1Permissions } from "../ip-location-permissions/locker-1-permissions";
import { locker2Permissions } from "../ip-location-permissions/locker-2-permissions";
import { locker3Permissions } from "../ip-location-permissions/locker-3-permissions";
import { refund1Permissions } from "../ip-location-permissions/refund-1-permissions";
import { refund2Permissions } from "../ip-location-permissions/refund-2-permissions";
import { refund3Permissions } from "../ip-location-permissions/refund-3-permissions";
import { souvenirPermissions } from "../ip-location-permissions/souvenir-permissions";
import { ticket1Permissions } from "../ip-location-permissions/ticket-1-permissions";
import { ticket2Permissions } from "../ip-location-permissions/ticket-2-permissions";
import { ticket3Permissions } from "../ip-location-permissions/ticket-3-permissions";

export enum IpLocationEnum {
  TICKET_1 = "192.168.10.21",
  TICKET_2 = "192.168.10.22",
  TICKET_3 = "192.168.10.23",
  REFUND_1 = "192.168.10.24",
  REFUND_2 = "192.168.10.25",
  REFUND_3 = "192.168.10.34",
  SOUVENIR = "192.168.10.20",
  LOCKER_1 = "192.168.10.26",
  LOCKER_2 = "192.168.10.27",
  LOCKER_3 = "192.168.10.28",
  FOOD_CORNER_1 = "192.168.10.35",
  FOOD_CORNER_2 = "192.168.10.36",
  FOOD_CORNER_3 = "192.168.10.44",
  IT_SUPPORT_1 = "192.168.10.33",
}

export const defaultIpLocationsDeployment = [
  {
    ip_address: IpLocationEnum.TICKET_1,
    pos: "Tiket 1",
    permissions: ticket1Permissions,
  },
  {
    ip_address: IpLocationEnum.TICKET_2,
    pos: "Tiket 2",
    permissions: ticket2Permissions,
  },
  {
    ip_address: IpLocationEnum.TICKET_3,
    pos: "Tiket 3",
    permissions: ticket3Permissions,
  },
  {
    ip_address: IpLocationEnum.REFUND_1,
    pos: "Refund 1",
    permissions: refund1Permissions,
  },
  {
    ip_address: IpLocationEnum.REFUND_2,
    pos: "Refund 2",
    permissions: refund2Permissions,
  },
  {
    ip_address: IpLocationEnum.REFUND_3,
    pos: "Refund 3",
    permissions: refund3Permissions,
  },
  {
    ip_address: IpLocationEnum.SOUVENIR,
    pos: "Souvenir",
    permissions: souvenirPermissions,
  },
  {
    ip_address: IpLocationEnum.LOCKER_1,
    pos: "Locker 1",
    permissions: locker1Permissions,
  },
  {
    ip_address: IpLocationEnum.LOCKER_2,
    pos: "Locker 2",
    permissions: locker2Permissions,
  },
  {
    ip_address: IpLocationEnum.LOCKER_3,
    pos: "Locker 3",
    permissions: locker3Permissions,
  },
  {
    ip_address: IpLocationEnum.FOOD_CORNER_1,
    pos: "Food Corner 1",
    permissions: foodCorner1Permissions,
  },
  {
    ip_address: IpLocationEnum.FOOD_CORNER_2,
    pos: "Food Corner 2",
    permissions: foodCorner2Permissions,
  },
  {
    ip_address: IpLocationEnum.FOOD_CORNER_3,
    pos: "Food Corner 3",
    permissions: foodCorner3Permissions,
  },
  {
    ip_address: IpLocationEnum.IT_SUPPORT_1,
    pos: "IT Support 1",
    permissions: itSupport1Permissions,
  },
];

export default defaultIpLocationsDeployment;
