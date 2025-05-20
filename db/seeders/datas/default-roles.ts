import { customerPermissions } from "../role-permissions/customer-permissions";
import { ownerPermissions } from "../role-permissions/owner-permisssions";

export enum RoleEnum {
  OWNER = "owner",
  CUSTOMER = "customer",
}

const defaultRoles = [
  {
    name: RoleEnum.OWNER,
    description: "Owner",
    permissions: ownerPermissions,
  },
  {
    name: RoleEnum.CUSTOMER,
    description: "Customer",
    permissions: customerPermissions,
  },
];

export default defaultRoles;
