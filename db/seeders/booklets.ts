import { db } from "@/db";
import { booklets } from "../schema";
import { getCurrentDate } from "@/lib/utils";

export async function bookletSeeder() {
  const data: (typeof booklets.$inferInsert)[] = [
    {
      code_start: "100001",
      code_end: "100010",
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setFullYear(end.getFullYear() + 1);
        return end;
      })(),
      is_active: true,
    },
    {
      code_start: "200001",
      code_end: "200010",
      periode_start: getCurrentDate(),
      periode_end: (() => {
        const end = getCurrentDate();
        end.setFullYear(end.getFullYear() + 1);
        return end;
      })(),
      is_active: true,
    },
  ];

  await Promise.all(
    data.map((dataItem) =>
      db.insert(booklets).values(dataItem).onDuplicateKeyUpdate({
        set: dataItem,
      }),
    ),
  );
}
