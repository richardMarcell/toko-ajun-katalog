import { CaptainOrderTableCheck } from "@/types/captain-order-table-check";
import { incrementTableCheckPrintCount } from "../captain-order/increment-table-check-print-count";

export async function printCaptainOrderTableCheck({
  tableCheck,
}: {
  tableCheck: CaptainOrderTableCheck;
}): Promise<{ response: { statusCode: number; errorMessage?: string } }> {
  try {
    const response = await fetch("http://localhost:8080/table-check", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_check: {
          ...tableCheck,
          date: tableCheck.date.toISOString(),
        },
      }),
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        response: {
          statusCode: response.status,
          errorMessage: result.message || "Fail to print table check",
        },
      };
    }

    await incrementTableCheckPrintCount(BigInt(tableCheck.id));

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
