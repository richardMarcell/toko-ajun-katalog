"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterCashqCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [wristbandCode, setWristbandCode] = useState<string>(
    searchParams.get("wristbandCode") as string,
  );

  const handleCheckCodeOnClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (wristbandCode) params.set("wristbandCode", wristbandCode);
    else params.delete("wristbandCode");

    router.push(`?${params.toString()}`);
  };
  return (
    <div>
      <div>
        <div>
          <Label htmlFor="wristband_code">CashQ Code</Label>
          <span className="text-qubu_red">*</span>
        </div>
      </div>
      <div className="flex justify-between gap-x-2">
        <Input
          id="wristband_code"
          placeholder="Masukkan CashQ Code"
          autoComplete="off"
          defaultValue={wristbandCode}
          onChange={(event) => {
            setWristbandCode(event.target.value);
          }}
        />
        <Button
          className="bg-qubu_blue"
          type="button"
          onClick={handleCheckCodeOnClick}
        >
          Check Code
        </Button>
      </div>
    </div>
  );
}
