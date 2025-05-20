export enum ProductCategoryEnum {
  MAIN_COURSE = "MAIN COURSE",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SOUP = "SOUP",
  DESSERTS = "DESSERTS",
  SIDE_DISH = "SIDE DISH",
  APPETIZER = "APPETIZER",
  BEVERAGES = "BEVERAGES",

  SWIMMING_ACCESSORIES = "SWIMMING ACCESSORIES",
  SWIMMING_EQUIPMENT = "SWIMMING EQUIPMENT",
  BATH_ESSENTIALS = "BATH ESSENTIALS",
  SKINCARE = "SKINCARE",

  SWIMMING_CLASS = "SWIMMING CLASS",

  ENTRY_PASS = "ENTRY PASS",

  LOCKER = "LOCKER",
  LOCKER_GAZEBO = "LOCKER GAZEBO",

  DIMSUM = "DIMSUM",

  WATER_PARK_TICKET = "WATER PARK TICKET",

  WRISTBAND = "WRISTBAND",
  TOP_UP = "TOP UP",

  RESTO_SPECIAL_ITEM = "RESTO SPECIAL ITEM",
}

export function getProductCategoryCase(category: ProductCategoryEnum): string {
  let productCategory = "";

  switch (category) {
    case ProductCategoryEnum.MAIN_COURSE:
      productCategory = "Main Course";
      break;
    case ProductCategoryEnum.LUNCH:
      productCategory = "Lunch";
      break;
    case ProductCategoryEnum.DINNER:
      productCategory = "Dinner";
      break;
    case ProductCategoryEnum.SOUP:
      productCategory = "Soup";
      break;
    case ProductCategoryEnum.DESSERTS:
      productCategory = "Desserts";
      break;
    case ProductCategoryEnum.SIDE_DISH:
      productCategory = "Side Dish";
      break;
    case ProductCategoryEnum.APPETIZER:
      productCategory = "Appetizer";
      break;
    case ProductCategoryEnum.BEVERAGES:
      productCategory = "Beverages";
      break;
    case ProductCategoryEnum.SWIMMING_ACCESSORIES:
      productCategory = "Swimming Accessories";
      break;
    case ProductCategoryEnum.SWIMMING_EQUIPMENT:
      productCategory = "Swimming Equipment";
      break;
    case ProductCategoryEnum.BATH_ESSENTIALS:
      productCategory = "Bath Essentials";
      break;
    case ProductCategoryEnum.SKINCARE:
      productCategory = "Skincare";
      break;
    case ProductCategoryEnum.SWIMMING_CLASS:
      productCategory = "Swimming Class";
      break;
    case ProductCategoryEnum.ENTRY_PASS:
      productCategory = "Entry Pass";
      break;
    case ProductCategoryEnum.DIMSUM:
      productCategory = "Dimsum";
      break;
    case ProductCategoryEnum.LOCKER:
      productCategory = "Loker";
      break;
    case ProductCategoryEnum.LOCKER_GAZEBO:
      productCategory = "Locker Gazebo";
      break;
    case ProductCategoryEnum.WATER_PARK_TICKET:
      productCategory = "Water Park Ticket";
      break;
    case ProductCategoryEnum.WRISTBAND:
      productCategory = "Wristband";
      break;
    case ProductCategoryEnum.TOP_UP:
      productCategory = "Top Up";
      break;
    case ProductCategoryEnum.RESTO_SPECIAL_ITEM:
      productCategory = "Resto Special Item";
      break;
    default:
      productCategory = "-";
      break;
  }

  return productCategory;
}

export function generateProductCategoryList(): {
  name: string;
}[] {
  const productCategoryList = Object.values(ProductCategoryEnum).map(
    (category) => {
      const productCategory = getProductCategoryCase(category);
      return {
        name: productCategory,
      };
    },
  );

  return productCategoryList;
}
