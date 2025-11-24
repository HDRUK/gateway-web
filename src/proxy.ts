import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import conf from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";
import { sessionCookie } from "./config/session";
import { RouteName } from "./consts/routeName";
import { logger } from "./utils/logger";

const isProd = process.env.NODE_ENV === "production";

export function proxy(request: NextRequest) {
    try {
        const token = request.cookies.get(conf.JWT_COOKIE)?.value;
        const authUser = getUserFromToken(token);
        const session = request.cookies.get(sessionCookie)?.value;

        if (
            request.nextUrl.pathname.startsWith(
                `/${RouteName.EN}/${RouteName.ACCOUNT}/`
            ) &&
            !authUser
        ) {
            const redirectResponse = NextResponse.redirect(
                new URL(RouteName.ERROR_401, request.url)
            );

            if (token) {
                // Remove the JWT cookie by setting it with maxAge: 0
                redirectResponse.cookies.set(conf.JWT_COOKIE, "", {
                    maxAge: 0,
                });
            }

            return redirectResponse;
        }

        const handleI18nRouting = createIntlMiddleware({
            locales: ["en"],
            defaultLocale: "en",
        });

        const response = handleI18nRouting(request);
        if (!session) {
            const id = v4();
            response.cookies.set(sessionCookie, id, {
                secure: isProd,
                sameSite: "strict",
            });

            logger.info("new session set", id, "middleware");
        }
        // Remove the JWT cookie if the token exists but the user is not authenticated
        if (!authUser && token) {
            response.cookies.set(conf.JWT_COOKIE, "", { maxAge: 0 });
        }

        return response;
    } catch (_) {
        return NextResponse.redirect(new URL(RouteName.ERROR_500, request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|widgets|.*\\..*).*)"],
};
