"use client"; // Error components must be Client Components

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PopularError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[100vh-84px] flex-col items-center justify-center">
      <Typography as={"h1"} variant={"h2"}>
        Something went wrong!
      </Typography>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </section>
  );
}
