import { RestoUnitConfig } from "@/lib/config/resto-unit-config";

export default function isAllowedRestoUnit(unit: string): boolean {
  if (unit in RestoUnitConfig) return true;
  else return false;
}
