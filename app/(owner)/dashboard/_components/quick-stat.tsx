import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStat({
  title,
  description,
  icon,
  totalData,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  totalData: number;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalData}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
