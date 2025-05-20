import { CaptainOrderBill } from "@/types/captain-order-bill";
import { incrementBillPrintCount } from "../captain-order/increment-bill-print-count";

export async function printCaptainOrderBill({
  captainOrderBill,
}: {
  captainOrderBill: CaptainOrderBill;
}): Promise<{ response: { statusCode: number; errorMessage?: string } }> {
  try {
    const response = await fetch("http://localhost:8080/captain-order-bill", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        captain_order_bill: {
          ...captainOrderBill,
          date: captainOrderBill.date.toISOString(),
        },
      }),
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        response: {
          statusCode: response.status,
          errorMessage: result.message || "Fail to print captain order bill",
        },
      };
    }

    await incrementBillPrintCount(BigInt(captainOrderBill.id));

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
