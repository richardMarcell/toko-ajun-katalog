import SettingCard from "@/components/internal/SettingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formaterDate, getCurrentDate } from "@/lib/utils";
import { Slash, User } from "lucide-react";
import { PieChartTotalCustomers } from "./pie-chart-total-customers";
import { QuickStat } from "./quick-stat";
import { SubQuickStat } from "./sub-quick-stat";
import Link from "next/link";

export function CardSectionDashboard({
  customers,
  totalCustomers,
  totalCustomersNotRefunded,
  totalWristbandsHasNotReturned,
}: {
  customers: {
    category: string;
    total: number;
  }[];
  totalCustomers: number;
  totalCustomersNotRefunded: number;
  totalWristbandsHasNotReturned: number;
}) {
  return (
    <SettingCard title="Dashboard" breadcrumb={<PageBreadcrumb />}>
      <div className="grid grid-cols-3 gap-4">
        <QuickStat
          icon={<User className="text-qubu_blue" />}
          description={`Total pengujung Keseluruhan Waterpark per periode ${formaterDate(getCurrentDate(), "date")}`}
          title="Pengunjung"
          totalData={totalCustomers}
        />
        <QuickStat
          icon={<User className="text-qubu_blue" />}
          description={`Total pengujung yang masih belum refund per periode ${formaterDate(getCurrentDate(), "date")}`}
          title="Belum Refund"
          totalData={totalCustomersNotRefunded}
        />
        <QuickStat
          icon={<User className="text-qubu_blue" />}
          description={`Total pengujung yang belum melakukan pengembalian gelang per periode ${formaterDate(getCurrentDate(), "date")}`}
          title="Gelang Belum Dikembalikan"
          totalData={totalWristbandsHasNotReturned}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {customers.map((customer) => (
          <SubQuickStat
            key={customer.category}
            title={customer.category}
            totalData={customer.total}
          />
        ))}
      </div>

      <PieChartTotalCustomers
        customers={customers}
        totalCustomers={totalCustomers}
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
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
