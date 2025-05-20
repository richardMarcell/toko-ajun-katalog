"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formaterDate, getCurrentDate } from "@/lib/utils";
import {
  Cell,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#60a5fa", "#f87171", "#facc15", "#34d399"];

export function PieChartTotalCustomers({
  customers,
  totalCustomers,
}: {
  customers: {
    total: number;
    category: string;
  }[];
  totalCustomers: number;
}) {
  const chartConfig: ChartConfig = customers.reduce((acc, cur, idx) => {
    acc[cur.category] = {
      label: cur.category,
      color: COLORS[idx % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-center font-bold">
        Grafik Total Pengunjung Waterpark Untuk Periode{" "}
        {formaterDate(getCurrentDate(), "date")}
      </h1>

      {totalCustomers === 0 && (
        <div className="text-center text-xl italic">
          Belum ada pengunjung yang terdaftar
        </div>
      )}

      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={customers}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={renderCustomLabel}
              labelLine={false}
            >
              {customers.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent className="w-36 p-2" />}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

const renderCustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps) => {
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) / 2;
  const x = Number(cx) + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = Number(cy) + radius * Math.sin(-midAngle * (Math.PI / 180));

  if (percent == 0) return <></>;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
