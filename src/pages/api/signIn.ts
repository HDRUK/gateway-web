import apis from "@/config/apis";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import config from "@/config/config";
import http from "@/utils/http";

interface PostResponse {
    data: {
        access_token: string;
        token_type: string;
    };
}

export default async function signIn(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { body } = req;

    console.log(apis.signInV1UrlIP);

    try {
        const { data } = await http.post<unknown, PostResponse>(
            apis.signInV1UrlIP,
            body
        );

        const cookie = serialize(config.JWT_COOKIE, data?.access_token, {
            httpOnly: true,
            path: "/",
        });

        res.setHeader("Set-Cookie", cookie);

        res.status(200).json({ message: "success" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        res.status(404).send({
            title: "We have not been able to log you in",
            message,
        });
    }
}
