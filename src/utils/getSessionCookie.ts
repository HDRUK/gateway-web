"use server";

import { cookies } from "next/headers";
import { sessionCookie } from "@/config/session";

export const getSessionCookie = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get(sessionCookie);
    const token = session?.value ?? 'N/A'
    return token;
};
