"use server";

import { removeDateTimezone } from "@/lib/utils";
import { SaleReceipt } from "@/types/sale-receipt";
import { incrementPrintCount } from "../sales/increment-print-count";
import { revalidatePath } from "next/cache";

export async function print({
  saleReceipt,
}: {
  saleReceipt: SaleReceipt;
}): Promise<{ response: { statusCode: number; errorMessage?: string } }> {
  try {
    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sales: { ...saleReceipt, date: removeDateTimezone(saleReceipt.date) },
      }),
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        response: {
          statusCode: response.status,
          errorMessage: result.message || "Fail to print receipt",
        },
      };
    }

    await incrementPrintCount(BigInt(saleReceipt.id));

    revalidatePath("/", "layout");

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
