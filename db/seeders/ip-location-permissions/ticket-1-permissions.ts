import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export const ticket1Permissions = [
  PermissionEnum.TICKET_SALES_CREATE,
  PermissionEnum.TICKET_SALES_STORE,
  PermissionEnum.TICKET_SALES_RECEIPT,
  PermissionEnum.TICKET_SALES_PRINT_RECEIPT,

  PermissionEnum.SALES_INDEX,
  PermissionEnum.SALES_VOID,
  PermissionEnum.SALES_REPRINT,

  PermissionEnum.SUPPORT_TICKET_STORE,
]