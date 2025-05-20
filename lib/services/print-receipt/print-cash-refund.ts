import { removeDateTimezone } from "@/lib/utils";
import { CashRefundReceipt } from "@/types/cash-refund-receipt";
import { incrementPrintCashRefundCount } from "../wallet-cash-refund/increment-print-count";

export async function printCashRefund({
  cashRefundReceipt,
}: {
  cashRefundReceipt: CashRefundReceipt;
}): Promise<{ response: { statusCode: number; errorMessage?: string } }> {
  try {
    const response = await fetch("http://localhost:8080/cash-refund", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cash_refund: {
          ...cashRefundReceipt,
          date: removeDateTimezone(cashRefundReceipt.date),
        },
      }),
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        response: {
          statusCode: response.status,
          errorMessage: result.message || "Fail to print cash refund receipt",
        },
      };
    }

    await incrementPrintCashRefundCount(BigInt(cashRefundReceipt.id));

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
