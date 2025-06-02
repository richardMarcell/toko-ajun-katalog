import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubQuickStat({
  title,
  totalData,
}: {
  title: string;
  totalData: number;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-b-4 border-b-qubu_red pb-2 text-center text-2xl font-bold">
          {totalData}
        </div>
      </CardContent>
    </Card>
  );
}
