"use client";

import { Button } from "@/components/ui/button";
import { updateProgress } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface UpdateProgressButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  slug: string;
  episode: number;
  watched: boolean;
}

export default function UpdateProgressButton({
  episode,
  slug,
  watched,
  className,
  ...props
}: UpdateProgressButtonProps) {
  const router = useRouter();
  const [isWatched, setIsWatched] = React.useOptimistic(watched);
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => {
    startTransition(async () => {
      setIsWatched(!isWatched);
      const res = await updateProgress({ episode, slug, watched });
      if (res.error) {
        toast.error(res.error);
      } else {
        router.refresh();
      }
    });
  };
  return (
    <Button
      {...props}
      onClick={handleClick}
      className={cn(isPending ? "" : "", className)}
    >
      Mark as {!isWatched ? "Watched" : "Unwatched"}
    </Button>
  );
}
