"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Throws while rendering, so the page's error.tsx shows. "Try again" brings the page back. */
export function CrashButton() {
  const [crash, setCrash] = useState(false);
  if (crash) throw new Error("Test error thrown from /dev");
  return (
    <Button variant="destructive" onClick={() => setCrash(true)}>
      Throw an error
    </Button>
  );
}
