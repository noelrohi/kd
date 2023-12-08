"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
}: React.ComponentPropsWithoutRef<"button">) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("flex gap-2", className)}
      size="sm"
      type="submit"
      disabled={pending}
    >
      {children}
    </Button>
  );
}
