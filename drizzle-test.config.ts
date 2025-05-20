import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema",
  out: "./db/migrations",
  dbCredentials: {
    url: "mysql://root:secret@localhost:3306/qubu_satellite_app_test",
  },
  migrations: {
    prefix: "timestamp",
  },
});
