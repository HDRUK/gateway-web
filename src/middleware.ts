import { getUserFromToken } from "@/utils/cookies";
import { NextResponse } from "next/server";
import conf from "@/config/config";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get(conf.JWT_COOKIE)?.value;
    const authUser = getUserFromToken(token);

    if (!authUser) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/account/:path*",
};
