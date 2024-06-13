import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import conf from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";
import { RouteName } from "./consts/routeName";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(conf.JWT_COOKIE)?.value;
    const authUser = getUserFromToken(token);

    if (
        request.nextUrl.pathname.startsWith(
            `/${RouteName.EN}/${RouteName.ACCOUNT}/`
        ) &&
        !authUser
    ) {
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
