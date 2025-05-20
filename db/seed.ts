import { permissionSeeder } from "./seeders/permissions";
import { roleHasPermissionSeeder } from "./seeders/role-has-permissions";
import { roleSeeder } from "./seeders/roles";
import { userSeeder } from "./seeders/users";

async function main() {
  console.log("Seed data....\n");

  console.log("Seed data role....\n");
  await roleSeeder();

  console.log("Seed data permission....\n");
  await permissionSeeder();

  console.log("Seed data role has permission....\n");
  await roleHasPermissionSeeder();

  console.log("Seed data user....\n");
  await userSeeder();

  console.log("Seed Data Success!!");

  process.exit(0);
}

main();
