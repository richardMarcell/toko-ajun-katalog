import { PermissionEnum } from "@/lib/enums/PermissionEnum";

export const ownerPermissions = [
  PermissionEnum.PRODUCT_CATEGORY_INDEX,
  PermissionEnum.PRODUCT_CATEGORY_CREATE,
  PermissionEnum.PRODUCT_CATEGORY_STORE,
  PermissionEnum.PRODUCT_CATEGORY_EDIT,
  PermissionEnum.PRODUCT_CATEGORY_UPDATE,
  PermissionEnum.PRODUCT_CATEGORY_DESTROY,

  PermissionEnum.PRODUCT_INDEX,
  PermissionEnum.PRODUCT_CREATE,
  PermissionEnum.PRODUCT_STORE,
  PermissionEnum.PRODUCT_EDIT,
  PermissionEnum.PRODUCT_UPDATE,
  PermissionEnum.PRODUCT_DESTROY,

  PermissionEnum.USER_INDEX,
  PermissionEnum.USER_CREATE,
  PermissionEnum.USER_STORE,
  PermissionEnum.USER_EDIT,
  PermissionEnum.USER_UPDATE,
  PermissionEnum.USER_DESTROY,

  PermissionEnum.SALES_EDIT,
  PermissionEnum.SALES_UPDATE,
];
