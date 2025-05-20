import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formaterDate } from "@/lib/utils";
import { ActivityLogIncludeRelationship } from "../_repositories/get-activity-logs";

export default function TableListActivityLog({
  activityLogs,
  offset,
}: {
  activityLogs: ActivityLogIncludeRelationship[];
  offset: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[48px]">#</TableHead>
          <TableHead className="w-[100px]">Tanggal & Waktu</TableHead>
          <TableHead className="w-[50px]">IP Address</TableHead>
          <TableHead className="w-[200px]">Pengguna</TableHead>
          <TableHead className="w-[300px]">Endpoint</TableHead>
          <TableHead className="w-[300px]">Payloads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activityLogs.map((activityLog, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{offset + index + 1}</TableCell>
              <TableCell>
                {formaterDate(activityLog.created_at, "dateTimeSecond")}
              </TableCell>
              <TableCell>{activityLog.ip_address}</TableCell>
              <TableCell>
                {activityLog.user ? activityLog.user.name : "-"}
              </TableCell>
              <TableCell>{activityLog.endpoint}</TableCell>
              <TableCell>
                {activityLog.payloads
                  ? JSON.stringify(activityLog.payloads)
                  : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableCaption>Daftar log aktivitas aplikasi Qubu Satellite</TableCaption>
    </Table>
  );
}
