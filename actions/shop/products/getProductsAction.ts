"use server";

import { getProducts } from "@/data/products/getProducts";

import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getProductsAction(
  cursor: number | null,
  gender?: "male" | "female" | "unisex" | null,
  favoritesOnly?: boolean,
  search?: string,
  tags?: string[],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return getProducts(session?.user.id, {
    cursor,
    limit: 6,
    gender,
    favoritesOnly,
    search,
    tags,
  });
}
