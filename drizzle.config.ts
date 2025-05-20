import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL as string;

if (!databaseUrl) {
  throw new Error("Database URL doesn't exist");
}

export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema",
  out: "./db/migrations",
  dbCredentials: {
    url: databaseUrl!,
  },
  migrations: {
    prefix: "timestamp",
  },
});
