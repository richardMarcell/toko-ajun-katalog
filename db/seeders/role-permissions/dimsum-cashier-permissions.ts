import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export const dimsumCashierPermissions = [
  PermissionEnum.DIMSUM_SALES_RECEIPT,
  PermissionEnum.DIMSUM_SALES_PRINT_RECEIPT,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_INDEX,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_SHOW,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_CREATE,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_STORE,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_EDIT,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_UPDATE,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_BILL,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_BILL,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_KITCHEN,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_KITCHEN,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_TABLE_CHECK,
  PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_TABLE_CHECK,

  PermissionEnum.DIMSUM_SALES_CREATE,
  PermissionEnum.DIMSUM_SALES_STORE,

  PermissionEnum.SALES_INDEX,
  PermissionEnum.SALES_VOID,
  PermissionEnum.SALES_REPRINT,

  PermissionEnum.SUPPORT_TICKET_STORE,
];
