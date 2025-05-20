"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toggleUpdatePermission } from "../[ipLocationId]/edit/_actions/toggle-update-permission";

export function CheckboxPermission({
  ipLocationId,
  permission,
  isChecked,
}: {
  ipLocationId: bigint;
  permission: {
    id: bigint;
    name: string;
    description: string;
  };
  isChecked: boolean;
}) {
  const [checked, setChecked] = useState(isChecked);

  const handleChange = async () => {
    const newChecked = !checked;
    setChecked(newChecked);
    await toggleUpdatePermission({
      ipLocationId: ipLocationId,
      permissionId: permission.id,
      checked: newChecked,
    });
  };

  return (
    <div className="flex cursor-pointer items-center">
      <Checkbox
        id={permission.id.toString()}
        name={permission.name}
        checked={checked}
        onCheckedChange={handleChange}
      />
      <Label
        htmlFor={permission.id.toString()}
        className="cursor-pointer pl-2 text-sm font-medium"
      >
        {permission.description}
      </Label>
    </div>
  );
}
