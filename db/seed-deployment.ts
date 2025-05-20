import { ipLocationSeeder } from "./seeders/deployment-seeder/ip-locations";

async function main() {
  console.log("Seed data....\n");

  console.log("Seed data Ip Locations....\n");
  await ipLocationSeeder();

  console.log("Seed Data Success!!");

  process.exit(0);
}

main();
