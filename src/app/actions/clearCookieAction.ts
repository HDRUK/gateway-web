"use server";

import { cookies } from "next/headers";

export async function clearCookieAction(cookie: string) {
    const cookieStore = await cookies();
    cookieStore.set(cookie, "", { maxAge: 0 });
}
