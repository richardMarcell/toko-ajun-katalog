"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";

export default function PollingTrigger() {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(async () => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return <Fragment />;
}
