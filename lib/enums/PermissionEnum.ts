export enum PermissionEnum {
  DASHBOARD = "dashboard",

  // Product
  PRODUCT_INDEX = "product-index",
  PRODUCT_CREATE = "product-create",
  PRODUCT_STORE = "product-store",
  PRODUCT_EDIT = "product-edit",
  PRODUCT_UPDATE = "product-update",
  PRODUCT_DESTROY = "product-destroy",

  // Product Category
  PRODUCT_CATEGORY_INDEX = "product_category-index",
  PRODUCT_CATEGORY_CREATE = "product_category-create",
  PRODUCT_CATEGORY_STORE = "product_category-store",
  PRODUCT_CATEGORY_EDIT = "product_category-edit",
  PRODUCT_CATEGORY_UPDATE = "product_category-update",
  PRODUCT_CATEGORY_DESTROY = "product_category-destroy",

  // Sales
  USER_INDEX = "user-index",
  USER_CREATE = "user-create",
  USER_STORE = "user-store",
  USER_EDIT = "user-edit",
  USER_UPDATE = "user-update",
  USER_DESTROY = "user-destroy",

  // Sales
  SALES_INDEX = "sales-index",
  SALES_CREATE = "sales-create",
  SALES_STORE = "sales-store",
  SALES_EDIT = "sales-edit",
  SALES_UPDATE = "sales-update",
  SALES_DESTROY = "sales-destroy",
}

export function getPermissionCase(type: PermissionEnum): {
  group: string;
  description: string;
} {
  let description = "";
  let group = "";

  switch (type) {
    // --- DASHBOARD ---
    case PermissionEnum.DASHBOARD:
      group = "Dashboard";
      description = "Dashboard";
      break;

    // --- PRODUCT ---
    case PermissionEnum.PRODUCT_INDEX:
      group = "Product";
      description = "Index";
      break;
    case PermissionEnum.PRODUCT_CREATE:
      group = "Product";
      description = "Create";
      break;
    case PermissionEnum.PRODUCT_STORE:
      group = "Product";
      description = "Store";
      break;
    case PermissionEnum.PRODUCT_EDIT:
      group = "Product";
      description = "Edit";
      break;
    case PermissionEnum.PRODUCT_UPDATE:
      group = "Product";
      description = "Update";
      break;
    case PermissionEnum.PRODUCT_DESTROY:
      group = "Product";
      description = "Destroy";
      break;

    // --- PRODUCT CATEGORY ---
    case PermissionEnum.PRODUCT_CATEGORY_INDEX:
      group = "Product Category";
      description = "Index";
      break;
    case PermissionEnum.PRODUCT_CATEGORY_CREATE:
      group = "Product Category";
      description = "Create";
      break;
    case PermissionEnum.PRODUCT_CATEGORY_STORE:
      group = "Product Category";
      description = "Store";
      break;
    case PermissionEnum.PRODUCT_CATEGORY_EDIT:
      group = "Product Category";
      description = "Edit";
      break;
    case PermissionEnum.PRODUCT_CATEGORY_UPDATE:
      group = "Product Category";
      description = "Update";
      break;
    case PermissionEnum.PRODUCT_CATEGORY_DESTROY:
      group = "Product Category";
      description = "Destroy";
      break;

    // --- USER ---
    case PermissionEnum.USER_INDEX:
      group = "User";
      description = "Index";
      break;
    case PermissionEnum.USER_CREATE:
      group = "User";
      description = "Create";
      break;
    case PermissionEnum.USER_STORE:
      group = "User";
      description = "Store";
      break;
    case PermissionEnum.USER_EDIT:
      group = "User";
      description = "Edit";
      break;
    case PermissionEnum.USER_UPDATE:
      group = "User";
      description = "Update";
      break;
    case PermissionEnum.USER_DESTROY:
      group = "User";
      description = "Destroy";
      break;

    // --- SALES ---
    case PermissionEnum.SALES_INDEX:
      group = "Sales";
      description = "Index";
      break;
    case PermissionEnum.SALES_CREATE:
      group = "Sales";
      description = "Create";
      break;
    case PermissionEnum.SALES_STORE:
      group = "Sales";
      description = "Store";
      break;
    case PermissionEnum.SALES_EDIT:
      group = "Sales";
      description = "Edit";
      break;
    case PermissionEnum.SALES_UPDATE:
      group = "Sales";
      description = "Update";
      break;
    case PermissionEnum.SALES_DESTROY:
      group = "Sales";
      description = "Destroy";
      break;

    default:
      group = "Unknown";
      description = "Unknown permission";
      break;
  }

  return { group, description };
}

export function generatePermissionList(): Array<{
  name: string;
  group: string;
  description: string;
}> {
  const permissionList = Object.values(PermissionEnum).map((permission) => {
    const { group, description } = getPermissionCase(permission);
    return {
      name: permission,
      group,
      description,
    };
  });

  return permissionList;
}
