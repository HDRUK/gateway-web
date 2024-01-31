import { AxiosError } from "axios";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import apis from "@/config/apis";
import config from "@/config/config";
import { extractSubdomain } from "@/utils/general";
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

    try {
        const { data } = await http.post<unknown, PostResponse>(
            apis.signInV1UrlIP,
            body
        );

        const cookie = serialize(config.JWT_COOKIE, data?.access_token, {
            httpOnly: true,
            path: "/",
            ...(process.env.NODE_ENV !== "development" && {
                domain: extractSubdomain(apis.apiV1IPUrl),
            }),
        });

        res.setHeader("Set-Cookie", cookie);

        res.status(200).json({ message: "success" });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (err?.response) {
            res.status(err.response.status).send({
                title: "We have not been able to log you in",
                message: err.response.data?.message,
            });
        } else {
            res.status(500).send({
                title: "We have not been able to log you in",
                message: err.message,
                stack: err.stack,
            });
        }
    }
}
