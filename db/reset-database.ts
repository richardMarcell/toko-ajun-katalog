import { sql } from "drizzle-orm";
import { db } from "@/db";

async function resetDatabase() {
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const tables = (await db.execute(
    sql`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`,
  )) as any[];

  for (const row of tables[0]) {
    const tableName = row.TABLE_NAME;
    await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${tableName}\``));
  }

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
  console.log("✅ All tables dropped");
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
