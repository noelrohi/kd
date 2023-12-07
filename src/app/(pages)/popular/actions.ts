"use server";

import { getTrending } from "@/lib/dramacool";

export async function getMore(page: number) {
  return await getTrending(page);
}
