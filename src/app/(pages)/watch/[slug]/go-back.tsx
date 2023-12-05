"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface GoBackProps {}

export default function GoBack({}: GoBackProps) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant={"ghost"}
      className="flex items-center gap-4"
    >
      <Icons.arrowLeft /> Back
    </Button>
  );
}
