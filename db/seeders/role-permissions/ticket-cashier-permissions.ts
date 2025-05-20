import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export const ticketCashierPermissions = [
  // Ticket
  PermissionEnum.TICKET_SALES_CREATE,
  PermissionEnum.TICKET_SALES_STORE,
  PermissionEnum.TICKET_SALES_RECEIPT,
  PermissionEnum.TICKET_SALES_PRINT_RECEIPT,

  // Sales
  PermissionEnum.SALES_INDEX,
  PermissionEnum.SALES_VOID,
  PermissionEnum.SALES_REPRINT,

  PermissionEnum.SUPPORT_TICKET_STORE,
];
