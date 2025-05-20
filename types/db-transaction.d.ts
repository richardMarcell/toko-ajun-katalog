import { MySqlTransaction } from "drizzle-orm/mysql-core";
import {
  MySql2PreparedQueryHKT,
  MySql2QueryResultHKT,
} from "drizzle-orm/mysql2";
import * as schema from "@/db/schema";
import { ExtractTablesWithRelations } from "drizzle-orm";

export type DatabaseTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
