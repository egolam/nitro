import { auth } from "@/auth";
import { headers } from "next/headers";

export const serverSession = await auth.api.getSession({
  headers: await headers(),
});
