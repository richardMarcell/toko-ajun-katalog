import { GazeboStatusEnum } from "@/lib/enums/GazeboStatusEnum";
import { cn } from "@/lib/utils";
import { Gazebo } from "@/types/gazebo";
import Link from "next/link";

const GazeboStyleMap = new Map([
  [GazeboStatusEnum.AVAILABLE, "bg-qubu_checker_light_green"],
  [GazeboStatusEnum.IN_USE, "bg-qubu_blue"],
  [GazeboStatusEnum.UNAVAILABLE, "bg-qubu_red"],
]);

export function GazeboList({ gazebos }: { gazebos: Gazebo[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {gazebos.map((gazebo) => {
        const gazeboBgColor =
          GazeboStyleMap.get(gazebo.status as GazeboStatusEnum) ?? "";
        return (
          <Link
            key={gazebo.id}
            href={`/back-office/gazebos/${gazebo.id}/edit`}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-lg border font-medium text-white",
              gazeboBgColor,
            )}
          >
            {gazebo.label}
          </Link>
        );
      })}
    </div>
  );
}
