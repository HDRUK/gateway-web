import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import apis from "@/config/apis";
import config from "@/config/config";
import { extractSubdomain } from "@/utils/general";

export default async function signIn(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { body } = req;

    try {
        const response = await fetch(apis.signInV1UrlIP, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();

        if (!json?.access_token) {
            res.status(500).json({ data: { message: "failed", ok: false } });
        }

        const cookie = serialize(config.JWT_COOKIE, json?.access_token, {
            httpOnly: true,
            path: "/",
            ...(process.env.NODE_ENV !== "development" && {
                domain: extractSubdomain(apis.apiV1IPUrl as string) || "",
            }),
        });

        res.setHeader("Set-Cookie", cookie);

        res.status(200).json({ data: { message: "success", ok: true } });
    } catch (error) {
        res.status(500).json({ data: { message: "failed", ok: false } });
    }
}
