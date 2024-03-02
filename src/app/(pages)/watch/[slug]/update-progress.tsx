"use client";

import { Button } from "@/components/ui/button";
import { updateWatchlist } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface UpdateWatchlistButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  slug: string;
  episode: number;
  watched: boolean;
}

export default function UpdateWatchlistButton({
  episode,
  slug,
  watched,
  className,
  ...props
}: UpdateWatchlistButtonProps) {
  const router = useRouter();
  const [isWatched, setIsWatched] = React.useOptimistic(watched);
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => {
    startTransition(async () => {
      setIsWatched(!isWatched);
      const res = await updateWatchlist({ episode, slug, watched });
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
