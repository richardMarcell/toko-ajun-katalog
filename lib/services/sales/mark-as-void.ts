import { sales } from "@/db/schema";
import { getCurrentDate } from "@/lib/utils";
import { DatabaseTransaction } from "@/types/db-transaction";
import { eq } from "drizzle-orm";

type MarkAsVoidProps = {
  salesId: bigint;
  userId: bigint;
  tx: DatabaseTransaction;
};

export async function markAsVoid({
  salesId,
  userId,
  tx,
}: MarkAsVoidProps): Promise<void> {
  await tx
    .update(sales)
    .set({ is_void: true, voided_by: userId, voided_at: getCurrentDate() })
    .where(eq(sales.id, salesId));
}
