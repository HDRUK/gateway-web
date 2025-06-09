import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionCookie } from "@/config/session";
import { extractSubdomain } from "@/utils/general";
import Log from "@/utils/logger";

let logger: Log | undefined;

if (!logger) {
    logger = new Log();
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const cookieStore = await cookies();
    const session = cookieStore.get(sessionCookie);

    if (!session?.value) {
        return NextResponse.json({ error: "no session" }, { status: 401 });
    }

    try {
        const response = await fetch(apis.signInV1UrlIP, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "x-Request-Session-Id": session.value,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Invalid details" },
                { status: 401 }
            );
        }

        const json = await response.json();

        const cookie = serialize(config.JWT_COOKIE, json?.access_token, {
            httpOnly: true,
            path: "/",
            ...(process.env.NODE_ENV !== "development" && {
                domain: extractSubdomain(apis.apiV1IPUrl as string) || "",
            }),
        });

        const res = NextResponse.json({ message: "success" });
        res.headers.set("Set-Cookie", cookie);

        return res;
    } catch (error) {
        logger!.error(error as string, session, "signIn");
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        ); // <-- Ensure response is always returned
    }
}
