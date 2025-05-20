import { db } from "@/db";
import { getDateStartTime } from "@/lib/utils";
import { Booklet } from "@/types/booklet";
import { sql } from "drizzle-orm";

export async function getValidBooklet(bookletCode: string): Promise<{
  booklet: Booklet | null;
}> {
  const today = getDateStartTime();

  bookletCode = bookletCode ? bookletCode : "";

  const booklet = await db.query.booklets.findFirst({
    where: (booklets, { eq, and, gte, lte }) =>
      and(
        eq(booklets.is_active, true),
        lte(booklets.periode_start, today),
        gte(booklets.periode_end, today),
        sql`CAST(${sql.raw("code_start")} AS UNSIGNED) <= ${bookletCode}`,
        sql`CAST(${sql.raw("code_end")} AS UNSIGNED) >= ${bookletCode}`,
      ),
  });

  if (!booklet)
    return {
      booklet: null,
    };

  return {
    booklet: booklet,
  };
}
