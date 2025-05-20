import { adminPermissions } from "../role-permissions/admin-permissions";
import { dimsumCashierPermissions } from "../role-permissions/dimsum-cashier-permissions";
import { foodCornerCashierPermissions } from "../role-permissions/food-corner-cashier-permissions";
import { foodCornerTenantPermissions } from "../role-permissions/food-corner-tenant-permissions";
import { lockerCashierPermissions } from "../role-permissions/locker-cashier-permissions";
import { patioCashierPermissions } from "../role-permissions/patio-cashier-permissions";
import { refundCashierPermissions } from "../role-permissions/refund-cashier-permissions";
import { souvenirCashierPermissions } from "../role-permissions/souvenir-cashier-permissions";
import { superAdminPermissions } from "../role-permissions/super-admin-permissions";
import { ticketCashierPermissions } from "../role-permissions/ticket-cashier-permissions";

export enum RoleEnum {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  FC_CASHIER = "fc_cashier",
  FC_TENANT = "fc_tenant",
  TICKET_CASHIER = "ticket_cashier",
  REFUND_CASHIER = "refund_cashier",
  SOUVENIR_CASHIER = "souvenir_cashier",
  LOCKER_CASHIER = "locker_cashier",
  DIMSUM_CASHIER = "dimsum_cashier",
  PATIO_CASHIER = "patio_cashier",
  NON_ROLE = "non_role",
}

const defaultRoles = [
  {
    name: RoleEnum.SUPER_ADMIN,
    description: "Super Admin",
    permissions: superAdminPermissions,
  },
  {
    name: RoleEnum.ADMIN,
    description: "Admin",
    permissions: adminPermissions,
  },
  {
    name: RoleEnum.FC_CASHIER,
    description: "Food Corner Cashier",
    permissions: foodCornerCashierPermissions,
  },
  {
    name: RoleEnum.FC_TENANT,
    description: "Food Corner Tenant",
    permissions: foodCornerTenantPermissions,
  },
  {
    name: RoleEnum.TICKET_CASHIER,
    description: "Ticket Cashier",
    permissions: ticketCashierPermissions,
  },
  {
    name: RoleEnum.REFUND_CASHIER,
    description: "Refund Cashier",
    permissions: refundCashierPermissions,
  },
  {
    name: RoleEnum.SOUVENIR_CASHIER,
    description: "Souvenir Cashier",
    permissions: souvenirCashierPermissions,
  },
  {
    name: RoleEnum.LOCKER_CASHIER,
    description: "Locker Cashier",
    permissions: lockerCashierPermissions,
  },
  {
    name: RoleEnum.DIMSUM_CASHIER,
    description: "Dimsum Cashier",
    permissions: dimsumCashierPermissions,
  },
  {
    name: RoleEnum.PATIO_CASHIER,
    description: "Patio Cashier",
    permissions: patioCashierPermissions,
  },
  {
    name: RoleEnum.NON_ROLE,
    description: "Non Role",
    permissions: [],
  },
];

export default defaultRoles;
