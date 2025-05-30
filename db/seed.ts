import { permissionSeeder } from "./seeders/permissions";
import { productCategorySeeder } from "./seeders/product-categories";
import { productSeeder } from "./seeders/products";
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

  console.log("Seed data product categories....\n");
  await productCategorySeeder();

  console.log("Seed data products....\n");
  await productSeeder();

  console.log("Seed Data Success!!");

  process.exit(0);
}

main();
