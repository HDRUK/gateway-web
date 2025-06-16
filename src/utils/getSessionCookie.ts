"use server"

import { cookies } from "next/headers";
import { sessionCookie } from "@/config/session";

export const getSessionCookie = async () => {
    const cookieStore = await cookies();
    const { value } = cookieStore.get(sessionCookie)!;

    return value;
};
