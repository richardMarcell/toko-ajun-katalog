"use client";

import { Input } from "../ui/input";
import { useEffect, useState } from "react";

type MoneyInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (value: number) => void;
  value?: number;
};

const moneyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function InputMoney(props: MoneyInputProps) {
  const { onChange, value, ...rest } = props;
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (typeof value === "number" && !isNaN(value)) {
      setDisplayValue(moneyFormatter.format(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const raw = ev.target.value.replace(/\D/g, "");
    const numericValue = Number(raw);
    setDisplayValue(moneyFormatter.format(numericValue));

    if (onChange) onChange(numericValue);
  }

  return (
    <Input
      type="text"
      {...rest}
      value={displayValue}
      onChange={handleChange}
      autoComplete="off"
    />
  );
}
