import { CaptainOrderKitchen } from "@/types/captain-order-kitchen";
import { incrementKitchenPrintCount } from "../captain-order/increment-kitchen-print-count";

export async function printCaptainOrderKitchen({
  kitchen,
}: {
  kitchen: CaptainOrderKitchen;
}): Promise<{ response: { statusCode: number; errorMessage?: string } }> {
  try {
    const response = await fetch("http://localhost:8080/kitchen", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kitchen: {
          ...kitchen,
          date: kitchen.date.toISOString(),
        },
      }),
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        response: {
          statusCode: response.status,
          errorMessage: result.message || "Fail to print kitchen",
        },
      };
    }

    await incrementKitchenPrintCount(BigInt(kitchen.id));

    return {
      response: {
        statusCode: response.status,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        response: {
          statusCode: 0,
          errorMessage: error.message,
        },
      };
    } else {
      return {
        response: {
          statusCode: 0,
          errorMessage: String(error),
        },
      };
    }
  }
}
