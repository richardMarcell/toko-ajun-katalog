import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStat({
  title,
  // description,
  icon,
  totalData,
}: {
  title: string;
  // description: string;
  icon: React.ReactNode;
  totalData: number | string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`text-right text-2xl font-bold`}>{totalData}</div>
        {/* <div>
          <div>
            <div className="w-full border border-black">
              <div
                className={cn("h-1 rounded", color)}
                style={{ width: percentage }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Grow</p>
            <p>{percentage}</p>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
