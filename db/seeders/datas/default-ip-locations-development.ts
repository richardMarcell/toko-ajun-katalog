import { developmentPermissions } from "../ip-location-permissions/development-permissions";

export enum IpLocationEnum {
  LOCAL_DEVICE = "127.0.0.1",
  DEVICE_TEST_DEV = "192.168.10.23",
  DEVICE_TEST_IWAN = "192.168.10.33",
  DEVICE_TEST_EDY = "192.168.10.75",
  DEVICE_TEST_YERI = "192.168.10.134",
}

export const defaultIpLocationsDevelopment = [
  {
    ip_address: IpLocationEnum.LOCAL_DEVICE,
    pos: "Local Device",
    permissions: developmentPermissions,
  },
  {
    ip_address: IpLocationEnum.DEVICE_TEST_DEV,
    pos: "Device Test Dev",
    permissions: developmentPermissions,
  },
  {
    ip_address: IpLocationEnum.DEVICE_TEST_IWAN,
    pos: "Device Test Dev - Iwan",
    permissions: developmentPermissions,
  },
  {
    ip_address: IpLocationEnum.DEVICE_TEST_EDY,
    pos: "Device Test Dev - Edy",
    permissions: developmentPermissions,
  },
  {
    ip_address: IpLocationEnum.DEVICE_TEST_YERI,
    pos: "Device Test Dev - Yeri",
    permissions: developmentPermissions,
  },
];

export default defaultIpLocationsDevelopment;
