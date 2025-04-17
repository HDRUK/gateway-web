"use server";

import { cookies } from "next/headers";

export async function clearCookieAction(cookie: string) {
    const cookieStore = cookies();
    cookieStore.set(cookie, "", { maxAge: 0 });
}
