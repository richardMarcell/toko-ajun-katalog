import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default async function DashboardPage() {
  return (
    <SettingCard title="Dashboard" breadcrumb={<PageBreadcrumb />}>
      <div></div>
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-blue-600">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
