import React from "react";
import { Button } from "@/components/ui/button";
import { Banknote, Edit, Plus, Printer, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "edit" | "pay" | "create" | "print" | "delete";
  withIcon?: boolean;
}

export function ButtonAction({
  label,
  variant,
  withIcon = false,
  className,
  ...props
}: ButtonActionProps) {
  const { icon, style } = variantConfig[variant];

  return (
    <Button
      className={cn(
        "flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70",
        style,
        className,
      )}
      {...props}
    >
      {withIcon && icon}
      <span>{label}</span>
    </Button>
  );
}

const variantConfig = {
  edit: {
    icon: <Edit />,
    style: "",
  },
  pay: {
    icon: <Banknote />,
    style: "bg-green-600",
  },
  create: {
    icon: <Plus />,
    style: "bg-blue-600",
  },
  print: {
    icon: <Printer />,
    style: "",
  },
  delete: {
    icon: <Trash />,
    style: "bg-red-600",
  },
};
