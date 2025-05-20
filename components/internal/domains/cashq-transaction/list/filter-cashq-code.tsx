"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function FilterCashqCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [wristbandCode, setWristbandCode] = useState<string>(
    searchParams.get("wristbandCode") as string,
  );

  const handleCheckCodeOnClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (wristbandCode) params.set("wristbandCode", wristbandCode);
    else params.delete("wristbandCode");

    router.push(`?${params.toString()}`);
  };
  return (
    <div>
      <div>
        <div>
          <Label>CashQ Code</Label>
          <span className="text-qubu_red">*</span>
        </div>
      </div>
      <form onSubmit={handleCheckCodeOnClick}>
        <div className="flex justify-between gap-x-2">
          <Input
            placeholder="Masukkan Kode CashQ"
            defaultValue={wristbandCode}
            autoComplete="off"
            id="wristbandCode"
            onChange={(event) => {
              setWristbandCode(event.target.value);
            }}
          />
          <Button className="bg-qubu_blue" type="submit">
            Check Code
          </Button>
        </div>
      </form>
    </div>
  );
}
