import PaginationPage from "@/components/internal/PaginationPage";
import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PermissionEnum } from "@/lib/enums/PermissionEnum";
import { getUserAuthenticated } from "@/lib/services/auth/get-user-authenticated";
import { can } from "@/lib/services/permissions/can";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { Slash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FilterSaleWaterparkTickets } from "./_components/filter-sale-waterpark-tickets";
import TableListSalesWaterparkTicket from "./_components/table-list-sales-waterpark-ticket";
import { getSalesWaterparkTicket } from "./_repositories/get-sales-waterpark-ticket";

export default async function SalesWaterparkTicketsIndexPage({
  searchParams,
}: {
  searchParams: Promise<
    BackOfficeSearchParams<{
      keyword: string;
      date: string;
    }>
  >;
}) {
  const user = await getUserAuthenticated();
  if (!user) redirect("/auth/login");

  await can({
    permissionNames: [PermissionEnum.BACK_OFFICE_GENTRANCE_INDEX],
    user: user,
  });

  const salesWaterparkTicketSearchParams = await searchParams;
  const { currentPage, currentPageSize, lastPage, offset, sales } =
    await getSalesWaterparkTicket({
      searchParams: salesWaterparkTicketSearchParams,
    });

  return (
    <SettingCard title="Waterpark" breadcrumb={<PageBreadcrumb />}>
      <FilterSaleWaterparkTickets />

      <TableListSalesWaterparkTicket sales={sales} offset={offset} />

      <PaginationPage
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        lastPage={lastPage}
      />
    </SettingCard>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href={`/back-office`}>Back Office</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Gentrance</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
