import { AxiosError } from "axios";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import apis from "@/config/apis";
import config from "@/config/config";
import { extractSubdomain } from "@/utils/general";
import http from "@/utils/http";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await http.post(apis.logoutV1UrlIP, null, {
            headers: {
                Authorization: `Bearer ${req.cookies[config.JWT_COOKIE]}`,
            },
            withCredentials: false,
        });

        const cookie = serialize(config.JWT_COOKIE, "", {
            expires: new Date(0),
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
                title: "We have not been able to log you out",
                message: err.response.data?.message,
            });
        } else {
            res.status(500).send({
                title: "We have not been able to log you out",
                message: err.message,
                stack: err.stack,
            });
        }
    }
}
