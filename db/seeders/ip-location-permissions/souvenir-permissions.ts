import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export const souvenirPermissions = [
  PermissionEnum.SOUVENIR_SALES_CREATE,
  PermissionEnum.SOUVENIR_SALES_STORE,
  PermissionEnum.SOUVENIR_SALES_RECEIPT,
  PermissionEnum.SOUVENIR_SALES_PRINT_RECEIPT,

  PermissionEnum.SWIMMING_CLASS_INDEX,
  PermissionEnum.SWIMMING_CLASS_CREATE,
  PermissionEnum.SWIMMING_CLASS_STORE,
  PermissionEnum.SWIMMING_CLASS_EDIT,
  PermissionEnum.SWIMMING_CLASS_UPDATE,
  PermissionEnum.SWIMMING_CLASS_SALES_CREATE,
  PermissionEnum.SWIMMING_CLASS_SALES_STORE,
  PermissionEnum.SWIMMING_CLASS_SALES_RECEIPT,
  PermissionEnum.SWIMMING_CLASS_SALES_PRINT_RECEIPT,
  PermissionEnum.SWIMMING_CLASS_DESTROY,

  PermissionEnum.ENTRY_PASS_INDEX,
  PermissionEnum.ENTRY_PASS_CREATE,
  PermissionEnum.ENTRY_PASS_STORE,
  PermissionEnum.ENTRY_PASS_EDIT_DETAIL_DATA,
  PermissionEnum.ENTRY_PASS_UPDATE_DETAIL_DATA,
  PermissionEnum.ENTRY_PASS_SALES_CREATE,
  PermissionEnum.ENTRY_PASS_SALES_STORE,
  PermissionEnum.ENTRY_PASS_SALES_RECEIPT,
  PermissionEnum.ENTRY_PASS_SALES_PRINT_RECEIPT,
  PermissionEnum.ENTRY_PASS_DESTROY,

  PermissionEnum.SALES_INDEX,
  PermissionEnum.SALES_VOID,
  PermissionEnum.SALES_REPRINT,

  PermissionEnum.SUPPORT_TICKET_STORE,
];
