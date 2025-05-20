import TableListCheckerHistory from "@/components/internal/domains/pos/food-corner/checker-history/list/table-list-checker-history";
import PaginationPage from "@/components/internal/PaginationPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { getSalesDetails } from "@/repositories/domain/pos/food-corner/checker-history/get-sales-details";
import { redirect } from "next/navigation";

export default async function CheckerIndexPage({
  searchParams,
}: {
  searchParams: Promise<{
    pageSize: string;
    page: string;
    tenantId: number | undefined;
  }>;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY,
      PermissionEnum.FOOD_CORNER_SALES_CHECKER_HISTORY_SHOW_ALL,
    ],
    user: user,
  });

  const userSearchParams = await searchParams;

  const { currentPage, currentPageSize, lastPage, salesDetails } =
    await getSalesDetails({
      user,
      searchParams: userSearchParams,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Checker History</CardTitle>
        <BreadcrumbPage />
      </CardHeader>
      <CardContent className="space-y-4">
        <TableListCheckerHistory salesDetails={salesDetails} />

        <PaginationPage
          currentPage={currentPage}
          currentPageSize={currentPageSize}
          lastPage={lastPage}
        />
      </CardContent>
    </Card>
  );
}

function BreadcrumbPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <div>Checker History</div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
