import { serialize } from "cookie";
import apis from "@/config/apis";
import config from "@/config/config";
import { extractSubdomain } from "@/utils/general";

export const expiredJwtCookie = (): string =>
    serialize(config.JWT_COOKIE, "", {
        expires: new Date(0),
        path: "/",
        ...(process.env.NODE_ENV !== "development" && {
            domain: extractSubdomain(apis.apiV1IPUrl as string) || "",
        }),
    });
