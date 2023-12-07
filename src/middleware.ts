import { getUserFromToken } from "@/utils/cookies";
import { NextResponse } from "next/server";
import conf from "@/config/config";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(conf.JWT_COOKIE)?.value;
    const authUser = getUserFromToken(token);

    if (request.nextUrl.pathname.startsWith("/en/account/") && !authUser) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    const handleI18nRouting = createIntlMiddleware({
        locales: ["en"],
        defaultLocale: "en",
    });
    const response = handleI18nRouting(request);
    return response;
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
