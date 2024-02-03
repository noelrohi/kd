"use client";

import { getProgressList, syncProgressToDB } from "@/lib/actions";
import * as React from "react";
import { toast } from "sonner";

export function BackupProgressButton({
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const [isPending, startTransition] = React.useTransition();
  return (
    <button
      {...props}
      onClick={() =>
        startTransition(async () => {
          toast.loading("Backing up your progress ...", { id: "backUpToast" });
          const parsedToJSON = JSON.parse(JSON.stringify(localStorage));
          const tupleList = Object.entries(parsedToJSON).filter(
            ([key, _]) => key.startsWith("kd-") && key !== "kd-playbackrate",
          );
          const progressList = tupleList.map(([k, v]) => ({
            key: k,
            value: JSON.parse(v as string),
          }));
          const response = await syncProgressToDB(progressList);
          if (!response.error) {
            toast.dismiss("backUpToast");
            toast.success(response.message);
          }
          if (response.error) toast.error(response.error);
        })
      }
      disabled={disabled || isPending}
    >
      {children}
    </button>
  );
}

export function SyncProgressButton({
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const [isPending, startTransition] = React.useTransition();
  return (
    <button
      {...props}
      onClick={() =>
        startTransition(async () => {
          toast.loading("Syncing your progress ...", { id: "syncToast" });
          const progressList = await getProgressList();
          for (const progress of progressList) {
            localStorage.setItem(progress.key, JSON.stringify(progress.value));
          }
          toast.dismiss("syncToast");
          toast.success("Sync successfully!");
        })
      }
      disabled={disabled || isPending}
    >
      {children}
    </button>
  );
}
