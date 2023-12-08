"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
}: React.ComponentPropsWithoutRef<"button">) {
  const { pending } = useFormStatus();
  return (
    <Button className="flex gap-2" type="submit" disabled={pending}>
      {children}
    </Button>
  );
}
