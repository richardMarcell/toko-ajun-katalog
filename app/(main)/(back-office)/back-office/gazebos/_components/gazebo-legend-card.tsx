import { Label } from "@/components/ui/label";
import {
  GazeboStatusEnum,
  getGazeboStatusCase,
} from "@/lib/enums/GazeboStatusEnum";
import {
  GazeboTypeEnum,
  getGazeboDisplayType,
} from "@/lib/enums/GazeboTypeEnum";
import { cn } from "@/lib/utils";

const GazeboStyleMap = new Map([
  [GazeboStatusEnum.AVAILABLE, "bg-qubu_checker_light_green"],
  [GazeboStatusEnum.IN_USE, "bg-qubu_blue"],
  [GazeboStatusEnum.UNAVAILABLE, "bg-qubu_red"],
]);

export function GazeboLegendCard({
  type,
  totalGazebo,
}: {
  type: string;
  totalGazebo: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">
          {getGazeboDisplayType(type as GazeboTypeEnum)}
        </h2>
        <p className="text-sm font-medium">
          Total Gazebo Tersedia: {totalGazebo}
        </p>
      </div>

      <div className="flex gap-4">
        {Object.values(GazeboStatusEnum).map((status) => {
          const gazeboBgColor = GazeboStyleMap.get(status) ?? "";
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded-sm", gazeboBgColor)}></div>
              <Label>{getGazeboStatusCase(status)}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
