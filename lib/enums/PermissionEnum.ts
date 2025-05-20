export enum PermissionEnum {
  FOOD_CORNER_SALES_INDEX = "food_corner-sales-index",
  FOOD_CORNER_SALES_SHOW = "food_corner-sales-show",
  FOOD_CORNER_SALES_CREATE = "food_corner-sales-create",
  FOOD_CORNER_SALES_STORE = "food_corner-sales-store",
  FOOD_CORNER_SALES_CHECKER = "food_corner-sales-checker",
  FOOD_CORNER_SALES_CHECKER_SHOW_ALL = "food_corner-sales-checker_show_all",
  FOOD_CORNER_SALES_CHECKER_HISTORY = "food_corner-sales-checker_history",
  FOOD_CORNER_SALES_CHECKER_HISTORY_SHOW_ALL = "food_corner-sales-checker_history_show_all",
  FOOD_CORNER_SALES_RECEIPT = "food_corner-sales-receipt",
  FOOD_CORNER_SALES_PRINT_RECEIPT = "food_corner-sales-print_receipt",

  SOUVENIR_SALES_CREATE = "souvenir-sales-create",
  SOUVENIR_SALES_STORE = "souvenir-sales-store",
  SOUVENIR_SALES_RECEIPT = "souvenir-sales-receipt",
  SOUVENIR_SALES_PRINT_RECEIPT = "souvenir-sales-print_receipt",

  SWIMMING_CLASS_INDEX = "swimming_class-index",
  SWIMMING_CLASS_CREATE = "swimming_class-create",
  SWIMMING_CLASS_STORE = "swimming_class-store",
  SWIMMING_CLASS_EDIT = "swimming_class-edit",
  SWIMMING_CLASS_UPDATE = "swimming_class-update",
  SWIMMING_CLASS_SALES_CREATE = "swimming_class-sales_create",
  SWIMMING_CLASS_SALES_STORE = "swimming_class-sales_store",
  SWIMMING_CLASS_SALES_RECEIPT = "swimming_class-sales_receipt",
  SWIMMING_CLASS_SALES_PRINT_RECEIPT = "swimming_class-sales_print_receipt",
  SWIMMING_CLASS_DESTROY = "swimming_class-destroy",

  LOCKER_SALES_CREATE = "locker-sales-create",
  LOCKER_SALES_STORE = "locker-sales-store",
  LOCKER_SALES_RECEIPT = "locker-sales-receipt",
  LOCKER_SALES_PRINT_RECEIPT = "locker-sales-print_receipt",

  WRISTBAND_RENT_WALLET_CREATE = "wristband_rent-wallet-create",
  WRISTBAND_RENT_WALLET_STORE = "wristband_rent-wallet-store",
  WRISTBAND_RENT_WALLET_RECEIPT = "wristband_rent-wallet-receipt",
  WRISTBAND_RENT_WALLET_PRINT_RECEIPT = "wristband_rent-wallet-print_receipt",

  ENTRY_PASS_INDEX = "entry_pass-index",
  ENTRY_PASS_CREATE = "entry_pass-create",
  ENTRY_PASS_STORE = "entry_pass-store",

  ENTRY_PASS_EDIT_ALL = "entry_pass-edit_all",
  ENTRY_PASS_EDIT_GENERAL_DATA = "entry_pass-edit_general_data",
  ENTRY_PASS_EDIT_DETAIL_DATA = "entry_pass-edit_detail_data",

  ENTRY_PASS_UPDATE_ALL = "entry_pass-update_all",
  ENTRY_PASS_UPDATE_GENERAL_DATA = "entry_pass-update_general_data",
  ENTRY_PASS_UPDATE_DETAIL_DATA = "entry_pass-update_detail_data",

  ENTRY_PASS_SALES_CREATE = "entry_pass-sales_create",
  ENTRY_PASS_SALES_STORE = "entry_pass-sales_store",
  ENTRY_PASS_SALES_RECEIPT = "entry_pass-sales_receipt",
  ENTRY_PASS_SALES_PRINT_RECEIPT = "entry_pass-sales_print_receipt",
  ENTRY_PASS_DESTROY = "entry_pass-destroy",

  SWIMSUIT_RENT_SALES_CREATE = "swimsuit_rent-sales-create",
  SWIMSUIT_RENT_SALES_STORE = "swimsuit_rent-sales-store",
  SWIMSUIT_RENT_SALES_RECEIPT = "swimsuit_rent-sales-receipt",
  SWIMSUIT_RENT_SALES_PRINT_RECEIPT = "swimsuit_rent-sales-print_receipt",
  SWIMSUIT_RENT_RETURN_INDEX = "swimsuit_rent_return-index",
  SWIMSUIT_RENT_RETURN_SHOW = "swimsuit_rent_return-show",

  CASHQ_TRANSACTION_INDEX = "cashq_transaction-index",
  CASHQ_TRANSACTION_VOID = "cashq_transaction-void",
  CASHQ_TRANSACTION_TOP_UP_CREATE = "cashq_transaction-top_up-create",
  CASHQ_TRANSACTION_TOP_UP_STORE = "cashq_transaction-top_up-store",
  CASHQ_TRANSACTION_TOP_UP_RECEIPT = "cashq_transaction-top_up-receipt",
  CASHQ_TRANSACTION_TOP_UP_PRINT_RECEIPT = "cashq_transaction-top_up-print_receipt",

  CASHQ_TRANSACTION_LOCKER_RENT_INDEX = "cashq_transaction-locker_rent-index",
  CASHQ_TRANSACTION_LOCKER_RENT_CREATE = "cashq_transaction-locker_rent-create",
  CASHQ_TRANSACTION_LOCKER_RENT_STORE = "cashq_transaction-locker_rent-store",
  CASHQ_TRANSACTION_LOCKER_RENT_EDIT = "cashq_transaction-locker_rent-edit",
  CASHQ_TRANSACTION_LOCKER_RENT_UPDATE = "cashq_transaction-locker_rent-update",
  CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_ADD_WRISTBAND = "cashq_transaction-locker_rent-update_add_wristband",
  CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_CHANGE_WRISTBAND = "cashq_transaction-locker_rent-update_change_wristband",
  CASHQ_TRANSACTION_LOCKER_RENT_RECEIPT = "cashq_transaction-locker_rent-receipt",
  CASHQ_TRANSACTION_LOCKER_RENT_PRINT_RECEIPT = "cashq_transaction-locker_rent-print_receipt",

  CASHQ_TRANSACTION_HISTORY_SHOW = "cashq_transaction-history-show",

  CASHQ_TRANSACTION_BINDING_CASHQ_INDEX = "cashq_transaction-binding_cashq-index",
  CASHQ_TRANSACTION_BINDING_CASHQ_CREATE = "cashq_transaction-binding_cashq-create",
  CASHQ_TRANSACTION_BINDING_CASHQ_STORE = "cashq_transaction-binding_cashq-store",
  CASHQ_TRANSACTION_BINDING_CASHQ_RECEIPT = "cashq_transaction-binding_cashq-receipt",
  CASHQ_TRANSACTION_BINDING_CASHQ_PRINT_RECEIPT = "cashq_transaction-binding_cashq-print_receipt",

  // DIMSUM_SALES_INDEX = "dimsum-sales-index",
  // DIMSUM_SALES_SHOW = "dimsum-sales-show",
  // DIMSUM_SALES_CREATE = "dimsum-sales-create",
  // DIMSUM_SALES_STORE = "dimsum-sales-store",
  // DIMSUM_SALES_CHECKER = "dimsum-sales-checker",
  // DIMSUM_SALES_CHECKER_HISTORY = "dimsum-sales-checker_history",
  // DIMSUM_SALES_RECEIPT = "dimsum-sales-receipt",
  // DIMSUM_SALES_PRINT_RECEIPT = "dimsum-sales-print_receipt",

  DIMSUM_CAPTAIN_ORDER_INDEX = "dimsum-captain_order-index",
  DIMSUM_CAPTAIN_ORDER_SHOW = "dimsum-captain_order-show",
  DIMSUM_CAPTAIN_ORDER_CREATE = "dimsum-captain_order-create",
  DIMSUM_CAPTAIN_ORDER_STORE = "dimsum-captain_order-store",
  DIMSUM_CAPTAIN_ORDER_EDIT = "dimsum-captain_order-edit",
  DIMSUM_CAPTAIN_ORDER_UPDATE = "dimsum-captain_order-update",
  DIMSUM_CAPTAIN_ORDER_TABLE_CHECK = "dimsum-captain_order-table_check",
  DIMSUM_CAPTAIN_ORDER_PRINT_TABLE_CHECK = "dimsum-captain_order-print_table_check",
  DIMSUM_CAPTAIN_ORDER_KITCHEN = "dimsum-captain_order-kitchen",
  DIMSUM_CAPTAIN_ORDER_PRINT_KITCHEN = "dimsum-captain_order-print_kitchen",
  DIMSUM_CAPTAIN_ORDER_BILL = "dimsum-captain_order-bill",
  DIMSUM_CAPTAIN_ORDER_PRINT_BILL = "dimsum-captain_order-print_bill",
  DIMSUM_SALES_CREATE = "dimsum-sales-create",
  DIMSUM_SALES_STORE = "dimsum-sales-store",
  DIMSUM_SALES_RECEIPT = "dimsum-sales-receipt",
  DIMSUM_SALES_PRINT_RECEIPT = "dimsum-sales-print_receipt",

  CASHQ_TRANSACTION_GAZEBO_RENT_INDEX = "cashq_transaction-gazebo_rent-index",
  CASHQ_TRANSACTION_GAZEBO_RENT_CREATE = "cashq_transaction-gazebo_rent-create",
  CASHQ_TRANSACTION_GAZEBO_RENT_STORE = "cashq_transaction-gazebo_rent-store",
  CASHQ_TRANSACTION_GAZEBO_RENT_EDIT = "cashq_transaction-gazebo_rent-edit",
  CASHQ_TRANSACTION_GAZEBO_RENT_UPDATE = "cashq_transaction-gazebo_rent-update",
  CASHQ_TRANSACTION_GAZEBO_RENT_RECEIPT = "cashq_transaction-gazebo_rent-receipt",
  CASHQ_TRANSACTION_GAZEBO_RENT_PRINT_RECEIPT = "cashq_transaction-gazebo_rent-print_receipt",

  CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW = "cashq_transaction-refund_wristband-show",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW_RENTED_WRISTBAND_LIST = "cashq_transaction-refund_wristband-show_rented_wristband_list", // deprecated
  CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_WRISTBAND_STATUS = "cashq_transaction-refund_wristband-update_wristband_status",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW_LOST_DAMAGED = "cashq_transaction-refund_wristband-update_deposit_withdraw_lost_damaged",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_WALLET_AND_WRISTBAND_LOST_DAMAGED = "cashq_transaction-refund_wristband-update_wallet_and_wristband_lost_damaged", // deprecated
  CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW = "cashq_transaction-refund_wristband-update_deposit_withdraw",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_SALDO_WITHDRAW = "cashq_transaction-refund_wristband-update_saldo_withdraw",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW_LOST_DAMAGED_ONLY = "cashq_transaction-refund_wristband-receipt_deposit_withdraw_lost_damaged_only", // deprecated
  CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_LOST_DAMAGED = "cashq_transaction-refund_wristband-receipt_lost_damaged",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW = "cashq_transaction-refund_wristband-receipt_deposit_withdraw",
  CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_SALDO_WITHDRAW = "cashq_transaction-refund_wristband-receipt_saldo_withdraw", // deprecated
  CASHQ_TRANSACTION_REFUND_WRISTBAND_PRINT_RECEIPT = "cashq_transaction-refund_wristband-print_receipt",

  TICKET_SALES_CREATE = "ticket-sales-create",
  TICKET_SALES_STORE = "ticket-sales-store",
  TICKET_SALES_RECEIPT = "ticket-sales-receipt",
  TICKET_SALES_PRINT_RECEIPT = "ticket-sales-print_receipt",

  RESTO_PATIO_CAPTAIN_ORDER_INDEX = "resto_patio-captain_order-index",
  RESTO_PATIO_CAPTAIN_ORDER_SHOW = "resto_patio-captain_order-show",
  RESTO_PATIO_CAPTAIN_ORDER_CREATE = "resto_patio-captain_order-create",
  RESTO_PATIO_CAPTAIN_ORDER_STORE = "resto_patio-captain_order-store",
  RESTO_PATIO_CAPTAIN_ORDER_EDIT = "resto_patio-captain_order-edit",
  RESTO_PATIO_CAPTAIN_ORDER_UPDATE = "resto_patio-captain_order-update",
  RESTO_PATIO_CAPTAIN_ORDER_TABLE_CHECK = "resto_patio-captain_order-table_check",
  RESTO_PATIO_CAPTAIN_ORDER_PRINT_TABLE_CHECK = "resto_patio-captain_order-print_table_check",
  RESTO_PATIO_CAPTAIN_ORDER_KITCHEN = "resto_patio-captain_order-kitchen",
  RESTO_PATIO_CAPTAIN_ORDER_PRINT_KITCHEN = "resto_patio-captain_order-print_kitchen",
  RESTO_PATIO_CAPTAIN_ORDER_BILL = "resto_patio-captain_order-bill",
  RESTO_PATIO_CAPTAIN_ORDER_PRINT_BILL = "resto_patio-captain_order-print_bill",
  RESTO_PATIO_SALES_CREATE = "resto_patio-sales-create",
  RESTO_PATIO_SALES_STORE = "resto_patio-sales-store",
  RESTO_PATIO_SALES_RECEIPT = "resto_patio-sales-receipt",
  RESTO_PATIO_SALES_PRINT_RECEIPT = "resto_patio-sales-print_receipt",

  // Sales
  SALES_INDEX_ALL = "sales-index_all",
  SALES_INDEX = "sales-index",
  SALES_VOID = "sales-void",
  SALES_REPRINT = "sales-reprint",

  // Back Office
  BACK_OFFICE = "back_office",

  // Back Office User
  BACK_OFFICE_USER_INDEX = "back_office-user-index",
  BACK_OFFICE_USER_CREATE = "back_office-user-create",
  BACK_OFFICE_USER_STORE = "back_office-user-store",
  BACK_OFFICE_USER_EDIT = "back_office-user-edit",
  BACK_OFFICE_USER_UPDATE = "back_office-user-update",
  BACK_OFFICE_USER_DESTROY = "back_office-user-destroy",

  // Back Office Wristband
  BACK_OFFICE_WRISTBAND_INDEX = "back_office-wristband-index",
  BACK_OFFICE_WRISTBAND_CREATE = "back_office-wristband-create",
  BACK_OFFICE_WRISTBAND_STORE = "back_office-wristband-store",
  BACK_OFFICE_WRISTBAND_EDIT = "back_office-wristband-edit",
  BACK_OFFICE_WRISTBAND_UPDATE = "back_office-wristband-update",
  BACK_OFFICE_WRISTBAND_DESTROY = "back_office-wristband-destroy",

  // Back Office Product
  BACK_OFFICE_PRODUCT_INDEX = "back_office-product-index",

  // Back Office Promo
  BACK_OFFICE_PROMO_INDEX = "back_office-promo-index",
  BACK_OFFICE_PROMO_CREATE = "back_office-promo-create",
  BACK_OFFICE_PROMO_STORE = "back_office-promo-store",
  BACK_OFFICE_PROMO_EDIT = "back_office-promo-edit",
  BACK_OFFICE_PROMO_UPDATE = "back_office-promo-update",
  BACK_OFFICE_PROMO_DESTROY = "back_office-promo-destroy",

  // Back Office Locker
  BACK_OFFICE_LOCKER_INDEX = "back_office-locker-index",
  BACK_OFFICE_LOCKER_CREATE = "back_office-locker-create",
  BACK_OFFICE_LOCKER_STORE = "back_office-locker-store",
  BACK_OFFICE_LOCKER_EDIT = "back_office-locker-edit",
  BACK_OFFICE_LOCKER_UPDATE = "back_office-locker-update",
  BACK_OFFICE_LOCKER_DESTROY = "back_office-locker-destroy",

  // Back Office Locker
  BACK_OFFICE_GAZEBO_INDEX = "back_office-gazebo-index",
  BACK_OFFICE_GAZEBO_CREATE = "back_office-gazebo-create",
  BACK_OFFICE_GAZEBO_STORE = "back_office-gazebo-store",
  BACK_OFFICE_GAZEBO_EDIT = "back_office-gazebo-edit",
  BACK_OFFICE_GAZEBO_UPDATE = "back_office-gazebo-update",
  BACK_OFFICE_GAZEBO_DESTROY = "back_office-gazebo-destroy",

  // Back Office Ip Location
  BACK_OFFICE_IP_LOCATION_INDEX = "back_office-ip_location-index",
  BACK_OFFICE_IP_LOCATION_CREATE = "back_office-ip_location-create",
  BACK_OFFICE_IP_LOCATION_STORE = "back_office-ip_location-store",
  BACK_OFFICE_IP_LOCATION_EDIT = "back_office-ip_location-edit",
  BACK_OFFICE_IP_LOCATION_UPDATE = "back_office-ip_location-update",
  BACK_OFFICE_IP_LOCATION_DESTROY = "back_office-ip_location-destroy",

  // Back Office Dashboard
  BACK_OFFICE_DASHBOARD = "back_office-dashboard",

  // Support Ticket
  SUPPORT_TICKET_STORE = "support_ticket-store",
  SUPPORT_TICKET_UPDATE = "support_ticket-update",

  // Back Office Gentrance
  BACK_OFFICE_GENTRANCE_INDEX = "back_office-gentrance-index",

  // Back Office Gfoodcorner
  BACK_OFFICE_GFOODCORNER_INDEX = "back_office-gfoodcorner-index",

  // Report
  REPORT = "report",

  // Report Food Corner
  REPORT_FOOD_CORNER = "report-food_corner",

  // Report Dashboard and Statistic
  REPORT_DASHBOARD_AND_STATISTIC = "report-dashboard_and_statistic",

  // Report ParadisQ Cashier Report
  REPORT_PARADISQ_CASHIER_REPORT = "report-paradisq_cashier_report",

  // Back Office Activity Log
  BACK_OFFICE_ACTIVITY_LOG_INDEX = "back_office-activity_log-index",

  // Back Office Tenant
  BACK_OFFICE_TENANT_INDEX = "back_office-tenant-index",
  BACK_OFFICE_TENANT_CREATE = "back_office-tenant-create",
  BACK_OFFICE_TENANT_STORE = "back_office-tenant-store",
  BACK_OFFICE_TENANT_EDIT = "back_office-tenant-edit",

  // Back Office Role
  BACK_OFFICE_ROLE_INDEX = "back_office-role-index",
  BACK_OFFICE_ROLE_CREATE = "back_office-role-create",
  BACK_OFFICE_ROLE_STORE = "back_office-role-store",
  BACK_OFFICE_ROLE_EDIT = "back_office-role-edit",
  BACK_OFFICE_ROLE_UPDATE = "back_office-role-update",
}

export function getPermissionCase(type: PermissionEnum): {
  group: string;
  description: string;
} {
  let description = "";
  let group = "";

  switch (type) {
    // --- FOOD CORNER ---
    case PermissionEnum.FOOD_CORNER_SALES_INDEX:
      group = "Food Corner";
      description = "Index";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_SHOW:
      group = "Food Corner";
      description = "Show";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_CREATE:
      group = "Food Corner";
      description = "Create";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_STORE:
      group = "Food Corner";
      description = "Store";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_CHECKER:
      group = "Food Corner";
      description = "Checker";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_CHECKER_SHOW_ALL:
      group = "Food Corner";
      description = "Checker Show All";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY:
      group = "Food Corner";
      description = "Checker History";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY_SHOW_ALL:
      group = "Food Corner";
      description = "Checker History Show All";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_RECEIPT:
      group = "Food Corner";
      description = "Receipt";
      break;
    case PermissionEnum.FOOD_CORNER_SALES_PRINT_RECEIPT:
      group = "Food Corner";
      description = "Print Receipt";
      break;

    // --- SOUVENIR ---
    case PermissionEnum.SOUVENIR_SALES_CREATE:
      group = "Souvenir";
      description = "Create";
      break;
    case PermissionEnum.SOUVENIR_SALES_STORE:
      group = "Souvenir";
      description = "Store";
      break;
    case PermissionEnum.SOUVENIR_SALES_RECEIPT:
      group = "Souvenir";
      description = "Receipt";
      break;
    case PermissionEnum.SOUVENIR_SALES_PRINT_RECEIPT:
      group = "Souvenir";
      description = "Print Receipt";
      break;

    // --- SWIMMING CLASS ---
    case PermissionEnum.SWIMMING_CLASS_INDEX:
      group = "Swimming Class";
      description = "Index";
      break;
    case PermissionEnum.SWIMMING_CLASS_CREATE:
      group = "Swimming Class";
      description = "Create";
      break;
    case PermissionEnum.SWIMMING_CLASS_STORE:
      group = "Swimming Class";
      description = "Store";
      break;
    case PermissionEnum.SWIMMING_CLASS_EDIT:
      group = "Swimming Class";
      description = "Edit";
      break;
    case PermissionEnum.SWIMMING_CLASS_UPDATE:
      group = "Swimming Class";
      description = "Update";
      break;
    case PermissionEnum.SWIMMING_CLASS_SALES_CREATE:
      group = "Swimming Class";
      description = "Sales Create";
      break;
    case PermissionEnum.SWIMMING_CLASS_SALES_STORE:
      group = "Swimming Class";
      description = "Sales Store";
      break;
    case PermissionEnum.SWIMMING_CLASS_SALES_RECEIPT:
      group = "Swimming Class";
      description = "Sales Receipt";
      break;
    case PermissionEnum.SWIMMING_CLASS_SALES_PRINT_RECEIPT:
      group = "Swimming Class";
      description = "Sales Print Receipt";
      break;
    case PermissionEnum.SWIMMING_CLASS_DESTROY:
      group = "Swimming Class";
      description = "Destroy";
      break;

    // --- LOCKER ---
    case PermissionEnum.LOCKER_SALES_CREATE:
      group = "Locker";
      description = "Create";
      break;
    case PermissionEnum.LOCKER_SALES_STORE:
      group = "Locker";
      description = "Store";
      break;
    case PermissionEnum.LOCKER_SALES_RECEIPT:
      group = "Locker";
      description = "Receipt";
      break;
    case PermissionEnum.LOCKER_SALES_PRINT_RECEIPT:
      group = "Locker";
      description = "Print Receipt";
      break;

    // --- WRISTBAND RENT WALLET ---
    case PermissionEnum.WRISTBAND_RENT_WALLET_CREATE:
      group = "Wristband Rent Wallet";
      description = "Create";
      break;
    case PermissionEnum.WRISTBAND_RENT_WALLET_STORE:
      group = "Wristband Rent Wallet";
      description = "Store";
      break;
    case PermissionEnum.WRISTBAND_RENT_WALLET_RECEIPT:
      group = "Wristband Rent Wallet";
      description = "Receipt";
      break;
    case PermissionEnum.WRISTBAND_RENT_WALLET_PRINT_RECEIPT:
      group = "Wristband Rent Wallet";
      description = "Print Receipt";
      break;

    // --- ENTRY PASS ---
    case PermissionEnum.ENTRY_PASS_INDEX:
      group = "Entry Pass";
      description = "Index";
      break;
    case PermissionEnum.ENTRY_PASS_CREATE:
      group = "Entry Pass";
      description = "Create";
      break;
    case PermissionEnum.ENTRY_PASS_STORE:
      group = "Entry Pass";
      description = "Store";
      break;
    case PermissionEnum.ENTRY_PASS_EDIT_ALL:
      group = "Entry Pass";
      description = "Edit All";
      break;
    case PermissionEnum.ENTRY_PASS_EDIT_GENERAL_DATA:
      group = "Entry Pass";
      description = "Edit General Data";
      break;
    case PermissionEnum.ENTRY_PASS_EDIT_DETAIL_DATA:
      group = "Entry Pass";
      description = "Edit Detail Data";
      break;
    case PermissionEnum.ENTRY_PASS_UPDATE_ALL:
      group = "Entry Pass";
      description = "Update All";
      break;
    case PermissionEnum.ENTRY_PASS_UPDATE_GENERAL_DATA:
      group = "Entry Pass";
      description = "Update General Data";
      break;
    case PermissionEnum.ENTRY_PASS_UPDATE_DETAIL_DATA:
      group = "Entry Pass";
      description = "Update Detail Data";
      break;
    case PermissionEnum.ENTRY_PASS_SALES_CREATE:
      group = "Entry Pass";
      description = "Sales Create";
      break;
    case PermissionEnum.ENTRY_PASS_SALES_STORE:
      group = "Entry Pass";
      description = "Sales Store";
      break;
    case PermissionEnum.ENTRY_PASS_SALES_RECEIPT:
      group = "Entry Pass";
      description = "Sales Receipt";
      break;
    case PermissionEnum.ENTRY_PASS_SALES_PRINT_RECEIPT:
      group = "Entry Pass";
      description = "Sales Print Receipt";
      break;
    case PermissionEnum.ENTRY_PASS_DESTROY:
      group = "Entry Pass";
      description = "Destroy";
      break;

    // --- SWIMSUIT RENT ---
    case PermissionEnum.SWIMSUIT_RENT_SALES_CREATE:
      group = "Swimsuit Rent";
      description = "Sales Create";
      break;
    case PermissionEnum.SWIMSUIT_RENT_SALES_STORE:
      group = "Swimsuit Rent";
      description = "Sales Store";
      break;
    case PermissionEnum.SWIMSUIT_RENT_SALES_RECEIPT:
      group = "Swimsuit Rent";
      description = "Sales Receipt";
      break;
    case PermissionEnum.SWIMSUIT_RENT_SALES_PRINT_RECEIPT:
      group = "Swimsuit Rent";
      description = "Sales Print Receipt";
      break;
    case PermissionEnum.SWIMSUIT_RENT_RETURN_INDEX:
      group = "Swimsuit Rent";
      description = "Return Index";
      break;
    case PermissionEnum.SWIMSUIT_RENT_RETURN_SHOW:
      group = "Swimsuit Rent";
      description = "Return Show";
      break;

    // --- CASHQ TRANSACTION ---
    case PermissionEnum.CASHQ_TRANSACTION_INDEX:
      group = "CashQ Transaction";
      description = "Index";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_VOID:
      group = "CashQ Transaction";
      description = "Void";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_TOP_UP_CREATE:
      group = "CashQ Transaction";
      description = "Top Up Create";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_TOP_UP_STORE:
      group = "CashQ Transaction";
      description = "Top Up Store";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_TOP_UP_RECEIPT:
      group = "CashQ Transaction";
      description = "Top Up Receipt";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_TOP_UP_PRINT_RECEIPT:
      group = "CashQ Transaction";
      description = "Top Up Print Receipt";
      break;

    // --- DIMSUM SALES ---
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_INDEX:
      group = "Dimsum";
      description = "Captain Order Index";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_SHOW:
      group = "Dimsum";
      description = "Captain Order Show";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_CREATE:
      group = "Dimsum";
      description = "Captain Order Create";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_STORE:
      group = "Dimsum";
      description = "Captain Order Store";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_EDIT:
      group = "Dimsum";
      description = "Captain Order Edit";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_UPDATE:
      group = "Dimsum";
      description = "Captain Order Update";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_BILL:
      group = "Dimsum";
      description = "Captain Order Bill";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_BILL:
      group = "Dimsum";
      description = "Captain Order Print Bill";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_KITCHEN:
      group = "Dimsum";
      description = "Captain Order Kitchen";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_KITCHEN:
      group = "Dimsum";
      description = "Captain Order Print Kitchen";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_TABLE_CHECK:
      group = "Dimsum";
      description = "Captain Order Table Check";
      break;
    case PermissionEnum.DIMSUM_CAPTAIN_ORDER_PRINT_TABLE_CHECK:
      group = "Dimsum";
      description = "Captain Order Print Table Check";
      break;
    case PermissionEnum.DIMSUM_SALES_CREATE:
      group = "Dimsum";
      description = "Create";
      break;
    case PermissionEnum.DIMSUM_SALES_STORE:
      group = "Dimsum";
      description = "Store";
      break;
    case PermissionEnum.DIMSUM_SALES_RECEIPT:
      group = "Dimsum";
      description = "Receipt";
      break;
    case PermissionEnum.DIMSUM_SALES_PRINT_RECEIPT:
      group = "Dimsum";
      description = "Print Receipt";
      break;

    // --- Ticket Sales ---
    case PermissionEnum.TICKET_SALES_CREATE:
      group = "Ticket";
      description = "Create";
      break;
    case PermissionEnum.TICKET_SALES_STORE:
      group = "Ticket";
      description = "Store";
      break;
    case PermissionEnum.TICKET_SALES_RECEIPT:
      group = "Ticket";
      description = "Receipt";
      break;
    case PermissionEnum.TICKET_SALES_PRINT_RECEIPT:
      group = "Ticket";
      description = "Print Receipt";
      break;

    // --- CashQ Transaction - Locker Rent ---
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_INDEX:
      group = "CashQ Transaction - Locker Rent";
      description = "Index";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_CREATE:
      group = "CashQ Transaction - Locker Rent";
      description = "Create";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_STORE:
      group = "CashQ Transaction - Locker Rent";
      description = "Store";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_EDIT:
      group = "CashQ Transaction - Locker Rent";
      description = "Edit";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE:
      group = "CashQ Transaction - Locker Rent";
      description = "Update";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_ADD_WRISTBAND:
      group = "CashQ Transaction - Locker Rent";
      description = "Update Add Wristband";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_UPDATE_CHANGE_WRISTBAND:
      group = "CashQ Transaction - Locker Rent";
      description = "Update Change Wristband";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_RECEIPT:
      group = "CashQ Transaction - Locker Rent";
      description = "Receipt";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_LOCKER_RENT_PRINT_RECEIPT:
      group = "CashQ Transaction - Locker Rent";
      description = "Print Receipt";
      break;

    // --- CashQ Transaction - History ---
    case PermissionEnum.CASHQ_TRANSACTION_HISTORY_SHOW:
      group = "CashQ Transaction - History";
      description = "Show";
      break;

    // --- CashQ Transaction - Binding CashQ ---
    case PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_INDEX:
      group = "CashQ Transaction - Binding CashQ";
      description = "Index";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_CREATE:
      group = "CashQ Transaction - Binding CashQ";
      description = "Create";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_STORE:
      group = "CashQ Transaction - Binding CashQ";
      description = "Store";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_RECEIPT:
      group = "CashQ Transaction - Binding CashQ";
      description = "Receipt";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_BINDING_CASHQ_PRINT_RECEIPT:
      group = "CashQ Transaction - Binding CashQ";
      description = "Print Receipt";
      break;

    // --- CashQ Transaction - Gazebo Rent ---
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_INDEX:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Index";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_CREATE:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Create";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_STORE:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Store";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_EDIT:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Edit";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_UPDATE:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Update";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_RECEIPT:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Receipt";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_GAZEBO_RENT_PRINT_RECEIPT:
      group = "CashQ Transaction - Gazebo Rent";
      description = "Print Receipt";
      break;

    // --- CashQ Transaction - Refund Wristband ---
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW:
      group = "CashQ Transaction - Refund Wristband";
      description = "Show";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_SHOW_RENTED_WRISTBAND_LIST:
      group = "CashQ Transaction - Refund Wristband";
      description = "Show Rented Wristband List";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_WRISTBAND_STATUS:
      group = "CashQ Transaction - Refund Wristband";
      description = "Update Wristband Status";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW_LOST_DAMAGED:
      group = "CashQ Transaction - Refund Wristband";
      description = "Update Deposit Withdraw Lost Damaged";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_WALLET_AND_WRISTBAND_LOST_DAMAGED:
      group = "CashQ Transaction - Refund Wristband";
      description = "Update Wallet And Wristband Lost Damaged";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_DEPOSIT_WITHDRAW:
      group = "CashQ Transaction - Refund Wristband";
      description = "Update Deposit Withdraw";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_UPDATE_SALDO_WITHDRAW:
      group = "CashQ Transaction - Refund Wristband";
      description = "Update Saldo Withdraw";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW_LOST_DAMAGED_ONLY:
      group = "CashQ Transaction - Refund Wristband";
      description = "Receipt Deposit Withdraw Lost Damaged Only";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_LOST_DAMAGED:
      group = "CashQ Transaction - Refund Wristband";
      description = "Receipt Lost Damaged";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_DEPOSIT_WITHDRAW:
      group = "CashQ Transaction - Refund Wristband";
      description = "Receipt Deposit Withdraw";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_RECEIPT_SALDO_WITHDRAW:
      group = "CashQ Transaction - Refund Wristband";
      description = "Receipt Saldo Withdraw";
      break;
    case PermissionEnum.CASHQ_TRANSACTION_REFUND_WRISTBAND_PRINT_RECEIPT:
      group = "CashQ Transaction - Refund Wristband";
      description = "Print Receipt";
      break;

    // Resto Patio
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_INDEX:
      group = "Resto Patio";
      description = "Captain Order Index";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_SHOW:
      group = "Resto Patio";
      description = "Captain Order Show";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_CREATE:
      group = "Resto Patio";
      description = "Captain Order Create";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_STORE:
      group = "Resto Patio";
      description = "Captain Order Store";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_EDIT:
      group = "Resto Patio";
      description = "Captain Order Edit";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_UPDATE:
      group = "Resto Patio";
      description = "Captain Order Update";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_BILL:
      group = "Resto Patio";
      description = "Captain Order Bill";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_PRINT_BILL:
      group = "Resto Patio";
      description = "Captain Order Print Bill";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_KITCHEN:
      group = "Resto Patio";
      description = "Captain Order Kitchen";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_PRINT_KITCHEN:
      group = "Resto Patio";
      description = "Captain Order Print Kitchen";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_TABLE_CHECK:
      group = "Resto Patio";
      description = "Captain Order Table Check";
      break;
    case PermissionEnum.RESTO_PATIO_CAPTAIN_ORDER_PRINT_TABLE_CHECK:
      group = "Resto Patio";
      description = "Captain Order Print Table Check";
      break;
    case PermissionEnum.RESTO_PATIO_SALES_CREATE:
      group = "Resto Patio";
      description = "Create";
      break;
    case PermissionEnum.RESTO_PATIO_SALES_STORE:
      group = "Resto Patio";
      description = "Store";
      break;
    case PermissionEnum.RESTO_PATIO_SALES_RECEIPT:
      group = "Resto Patio";
      description = "Receipt";
      break;
    case PermissionEnum.RESTO_PATIO_SALES_PRINT_RECEIPT:
      group = "Resto Patio";
      description = "Print Receipt";
      break;

    // Sales
    case PermissionEnum.SALES_INDEX_ALL:
      group = "Sales";
      description = "Index All";
      break;
    case PermissionEnum.SALES_INDEX:
      group = "Sales";
      description = "Index";
      break;
    case PermissionEnum.SALES_VOID:
      group = "Sales";
      description = "Void";
      break;
    case PermissionEnum.SALES_REPRINT:
      group = "Sales";
      description = "Reprint";
      break;

    // Back Office
    case PermissionEnum.BACK_OFFICE:
      group = "Back Office";
      description = "Back Office Access";
      break;

    // Back Office User
    case PermissionEnum.BACK_OFFICE_USER_INDEX:
      group = "Back Office User";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_USER_CREATE:
      group = "Back Office User";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_USER_STORE:
      group = "Back Office User";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_USER_EDIT:
      group = "Back Office User";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_USER_UPDATE:
      group = "Back Office User";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_USER_DESTROY:
      group = "Back Office User";
      description = "Destroy";
      break;

    // Back Office Wristband
    case PermissionEnum.BACK_OFFICE_WRISTBAND_INDEX:
      group = "Back Office Wristband";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_WRISTBAND_CREATE:
      group = "Back Office Wristband";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_WRISTBAND_STORE:
      group = "Back Office Wristband";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_WRISTBAND_EDIT:
      group = "Back Office Wristband";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_WRISTBAND_UPDATE:
      group = "Back Office Wristband";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_WRISTBAND_DESTROY:
      group = "Back Office Wristband";
      description = "Destroy";
      break;

    // Back Office Product
    case PermissionEnum.BACK_OFFICE_PRODUCT_INDEX:
      group = "Back Office Product";
      description = "Index";
      break;

    // Back Office Promo
    case PermissionEnum.BACK_OFFICE_PROMO_INDEX:
      group = "Back Office Promo";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_PROMO_CREATE:
      group = "Back Office Promo";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_PROMO_STORE:
      group = "Back Office Promo";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_PROMO_EDIT:
      group = "Back Office Promo";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_PROMO_UPDATE:
      group = "Back Office Promo";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_PROMO_DESTROY:
      group = "Back Office Promo";
      description = "Destroy";
      break;

    // Back Office Locker
    case PermissionEnum.BACK_OFFICE_LOCKER_INDEX:
      group = "Back Office Locker";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_LOCKER_CREATE:
      group = "Back Office Locker";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_LOCKER_STORE:
      group = "Back Office Locker";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_LOCKER_EDIT:
      group = "Back Office Locker";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_LOCKER_UPDATE:
      group = "Back Office Locker";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_LOCKER_DESTROY:
      group = "Back Office Locker";
      description = "Destroy";
      break;

    // Back Office Gazebo
    case PermissionEnum.BACK_OFFICE_GAZEBO_INDEX:
      group = "Back Office Gazebo";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_GAZEBO_CREATE:
      group = "Back Office Gazebo";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_GAZEBO_STORE:
      group = "Back Office Gazebo";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_GAZEBO_EDIT:
      group = "Back Office Gazebo";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_GAZEBO_UPDATE:
      group = "Back Office Gazebo";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_GAZEBO_DESTROY:
      group = "Back Office Gazebo";
      description = "Destroy";
      break;

    // Back Office IP Location
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_INDEX:
      group = "Back Office IP Location";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_CREATE:
      group = "Back Office IP Location";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_STORE:
      group = "Back Office IP Location";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_EDIT:
      group = "Back Office IP Location";
      description = "Edit";
      break;
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_UPDATE:
      group = "Back Office IP Location";
      description = "Update";
      break;
    case PermissionEnum.BACK_OFFICE_IP_LOCATION_DESTROY:
      group = "Back Office IP Location";
      description = "Destroy";
      break;

    // Back Office Dashboard
    case PermissionEnum.BACK_OFFICE_DASHBOARD:
      group = "Back Office Dashboard";
      description = "Dashboard";
      break;

    // Support Ticket
    case PermissionEnum.SUPPORT_TICKET_STORE:
      group = "Support Ticket";
      description = "Store";
      break;
    case PermissionEnum.SUPPORT_TICKET_UPDATE:
      group = "Support Ticket";
      description = "Update";
      break;

    // Back Office Gentrance
    case PermissionEnum.BACK_OFFICE_GENTRANCE_INDEX:
      group = "Back Office Gentrance";
      description = "Index";
      break;

    // Back Office Gfoodcorner
    case PermissionEnum.BACK_OFFICE_GFOODCORNER_INDEX:
      group = "Back Office Gfoodcorner";
      description = "Index";
      break;

    // Report
    case PermissionEnum.REPORT:
      group = "Report";
      description = "Report Access";
      break;

    // Report Food Corner
    case PermissionEnum.REPORT_FOOD_CORNER:
      group = "Report";
      description = "Food Corner";
      break;

    // Report Dashboard and Statistic
    case PermissionEnum.REPORT_DASHBOARD_AND_STATISTIC:
      group = "Report";
      description = "Dashboard and Statistic";
      break;

    // Report ParadisQ Cashier Report
    case PermissionEnum.REPORT_PARADISQ_CASHIER_REPORT:
      group = "Report";
      description = "ParadisQ Cashier Report";
      break;

    // Back Office Activity Log
    case PermissionEnum.BACK_OFFICE_ACTIVITY_LOG_INDEX:
      group = "Back Office Activity Log";
      description = "Index";
      break;

    // Back Office Tenant
    case PermissionEnum.BACK_OFFICE_TENANT_INDEX:
      group = "Back Office Tenant";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_TENANT_CREATE:
      group = "Back Office Tenant";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_TENANT_STORE:
      group = "Back Office Tenant";
      description = "Store";
      break;
    case PermissionEnum.BACK_OFFICE_TENANT_EDIT:
      group = "Back Office Tenant";
      description = "Edit";
      break;

    // Back Office Role
    case PermissionEnum.BACK_OFFICE_ROLE_INDEX:
      group = "Back Office Role";
      description = "Index";
      break;
    case PermissionEnum.BACK_OFFICE_ROLE_CREATE:
      group = "Back Office Role";
      description = "Create";
      break;
    case PermissionEnum.BACK_OFFICE_ROLE_STORE:
      group = "Back Office Role";
      description = "Store";
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
