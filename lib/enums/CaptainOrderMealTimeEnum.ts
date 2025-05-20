export enum CaptainOrderMealTimeEnum {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  COFFEE_BREAK = "COFFEE BREAK",
}

export function getCaptainOrderMealTimeCase(
  time: CaptainOrderMealTimeEnum,
): string {
  let mealTime = "";

  switch (time) {
    case CaptainOrderMealTimeEnum.BREAKFAST:
      mealTime = "Breakfast";
      break;
    case CaptainOrderMealTimeEnum.LUNCH:
      mealTime = "Lunch";
      break;
    case CaptainOrderMealTimeEnum.DINNER:
      mealTime = "Dinner";
      break;
    case CaptainOrderMealTimeEnum.COFFEE_BREAK:
      mealTime = "Coffee Break";
      break;
    default:
      mealTime = "-";
      break;
  }

  return mealTime;
}
