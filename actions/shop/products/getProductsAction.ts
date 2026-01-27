"use server";

import { getProducts } from "@/data/products/getProducts";

import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getProductsAction(
  cursor: string | null,
  gender?: "male" | "female" | "unisex" | null,
  favoritesOnly?: boolean,
  search?: string,
  tags?: string[],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const dateCursor = cursor ? new Date(cursor) : null;
  return getProducts(session?.user.id, {
    cursor: dateCursor,
    limit: 8,
    gender,
    favoritesOnly,
    search,
    tags,
  });
}
