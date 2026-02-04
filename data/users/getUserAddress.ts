import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getUserAddress(userId: string) {
  const address = await db.query.userAddresses.findFirst({
    where: and(
      eq(userAddresses.userId, userId),
      eq(userAddresses.isDefault, true),
      eq(userAddresses.isActive, true),
    ),
  });

  return address;
}
