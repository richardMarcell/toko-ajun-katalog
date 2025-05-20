import { db } from "@/db";
import { captainOrders, tables as tableSchema } from "@/db/schema";
import { UnitBusinessSateliteQubuEnum } from "@/lib/enums/UnitBusinessSateliteQubuEnum";
import { CaptainOrder } from "@/types/captain-order";
import { Table } from "@/types/table";
import { desc, eq } from "drizzle-orm";

export type TableIncludeRelationship = Table & {
  captainOrders: CaptainOrder[];
};

export async function getTables(): Promise<{
  tables: TableIncludeRelationship[];
}> {
  const tables = await db.query.tables.findMany({
    with: {
      captainOrders: {
        orderBy: desc(captainOrders.created_at),
        limit: 1,
      },
    },
    where: eq(tableSchema.unit_business, UnitBusinessSateliteQubuEnum.DIMSUM),
  });

  return {
    tables: tables,
  };
}
