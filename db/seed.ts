import { bookletPromoSeeder } from "./seeders/booklet-promo";
import { bookletSeeder } from "./seeders/booklets";
import { customerOriginSeeder } from "./seeders/customer-origins";
import { existingUserSeeder } from "./seeders/existing-users";
import { gazeboSeeder } from "./seeders/gazebos";
import { ipLocationHasPermissionSeeder } from "./seeders/ip-location-has-permissions";
import { ipLocationSeeder } from "./seeders/ip-locations";
import { lockerSeeder } from "./seeders/lockers";
import { permissionSeeder } from "./seeders/permissions";
import { productCategorySeeder } from "./seeders/product-categories";
import { productSeeder } from "./seeders/products";
import { promoSeeder } from "./seeders/promos";
import { roleHasPermissionSeeder } from "./seeders/role-has-permissions";
import { roleSeeder } from "./seeders/roles";
import { roomSeeder } from "./seeders/rooms";
import { stockSwimsuitRentSeeder } from "./seeders/stock-swimsuit-rent";
import { stockSeeder } from "./seeders/stocks";
import { tableSeeder } from "./seeders/tables";
import { tenantSeeder } from "./seeders/tenants";
import { unitBusinessHasPromoSeeder } from "./seeders/unit-business-has-promo";
import { userSeeder } from "./seeders/users";
import { vendorTypeSeeder } from "./seeders/vendor-types";
import { wristbandSeeder } from "./seeders/wristbands";

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

  console.log("Seed data table....\n");
  await tableSeeder();

  console.log("Seed data room....\n");
  await roomSeeder();

  console.log("Seed data tenant....\n");
  await tenantSeeder();

  console.log("Seed data product category....\n");
  await productCategorySeeder();

  console.log("Seed data product....\n");
  await productSeeder();

  console.log("Seed data stock....\n");
  await stockSeeder();

  console.log("Seed data stock swimsuit rent....\n");
  await stockSwimsuitRentSeeder();

  console.log("Seed data promo....\n");
  await promoSeeder();

  console.log("Seed data unit business has promo....\n");
  await unitBusinessHasPromoSeeder();

  console.log("Seed data wristband....\n");
  await wristbandSeeder();

  console.log("Seed data locker....\n");
  await lockerSeeder();

  console.log("Seed data gazebo....\n");
  await gazeboSeeder();

  console.log("Seed data customer origin....\n");
  await customerOriginSeeder();

  console.log("Seed data vendor type....\n");
  await vendorTypeSeeder();

  console.log("Seed data booklet....\n");
  await bookletSeeder();

  console.log("Seed data booklet promo....\n");
  await bookletPromoSeeder();

  console.log("Seed data IP location....\n");
  await ipLocationSeeder();

  console.log("Seed data Existing User....\n");
  await existingUserSeeder();

  console.log("Seed data IP location has permission....\n");
  await ipLocationHasPermissionSeeder();

  console.log("Seed Data Success!!");

  process.exit(0);
}

main();
