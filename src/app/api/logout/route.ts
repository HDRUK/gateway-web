import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { expiredJwtCookie } from "@/utils/expiredJwtCookie";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";

export async function GET() {
    const session = await getSessionCookie();

    const cookieStore = await cookies();
    const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

    try {
        await fetch(apis.logoutV1UrlIP, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                [sessionHeader]: sessionPrefix + session,
            },
        });

        const response = NextResponse.json(
            { message: "success" },
            { status: 200 }
        );

        response.headers.set("Set-Cookie", expiredJwtCookie());
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
        logger.error(err, session, `api/logout`);

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
