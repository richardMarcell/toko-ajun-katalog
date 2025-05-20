import PollingTrigger from "@/components/internal/domains/polling-trigger";
import TableListChecker from "@/components/internal/domains/pos/food-corner/checker/list/table-list-checker";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSalesDetails } from "@/repositories/domain/pos/food-corner/checker/get-sales-details";
import { redirect } from "next/navigation";

export default async function CheckerIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId: number | undefined }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.FOOD_CORNER_SALES_CHECKER,
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_SHOW_ALL,
    ],
    user: user,
  });

  const userSearchParams = await searchParams;

  const { salesDetails } = await getSalesDetails({
    user,
    searchParams: userSearchParams,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Checker</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent>
        <TableListChecker salesDetails={salesDetails} />
        <PollingTrigger />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <div>Checker</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
