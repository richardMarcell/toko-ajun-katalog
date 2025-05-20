import React from "react";
import { Button } from "@/components/ui/button";
import { Banknote, Edit, Plus, Printer, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  href: string;
  variant: "edit" | "pay" | "create" | "print" | "delete";
  withIcon?: boolean;
}

export function ButtonLink({
  label,
  href,
  variant,
  withIcon = false,
  className,
  disabled,
  ...props
}: ButtonLinkProps) {
  const { icon, style } = variantConfig[variant];

  return (
    <Button
      asChild
      className={cn(
        style,
        className,
        disabled ? "pointer-events-none cursor-not-allowed opacity-70" : "",
      )}
      {...props}
    >
      <Link href={href} className="flex gap-2">
        {withIcon && icon}
        <span>{label}</span>
      </Link>
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
    style: "bg-qubu_green",
  },
  create: {
    icon: <Plus />,
    style: "bg-qubu_blue",
  },
  print: {
    icon: <Printer />,
    style: "",
  },
  delete: {
    icon: <Trash />,
    style: "bg-qubu_red",
  },
};
