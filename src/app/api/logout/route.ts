import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { extractSubdomain } from "@/utils/general";
import { getSessionCookie } from "@/utils/getSessionCookie";

export async function GET(req: NextRequest) {
    const session = await getSessionCookie();

    if (!session) {
        return NextResponse.json({ error: "no session" }, { status: 401 });
    }
    const jwtToken = req.cookies.get(config.JWT_COOKIE)?.value;

    try {
        await fetch(apis.logoutV1UrlIP, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                [sessionHeader]: sessionPrefix + session,
            },
        });

        const cookie = serialize(config.JWT_COOKIE, "", {
            expires: new Date(0),
            path: "/",
            ...(process.env.NODE_ENV !== "development" && {
                domain: extractSubdomain(apis.apiV1IPUrl as string) || "",
            }),
        });

        const response = NextResponse.json(
            { message: "success" },
            { status: 200 }
        );

        response.headers.set("Set-Cookie", cookie);
        return response;
    } catch (error) {
        const err = error as {
            response?: {
                status: number;
                data?: { message: string };
            };
            stack?: unknown;
            message: string;
        };

        const status = err?.response?.status ?? 500;
        const message = err?.response?.data?.message ?? err.message;

        return NextResponse.json(
            {
                title: "We have not been able to log you out",
                message,
                stack: err.stack,
            },
            { status }
        );
    }
}
