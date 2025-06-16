import Cookies from "js-cookie";
import { NextApiRequest, NextApiResponse } from "next";
import apis from "@/config/apis";
import config from "@/config/config";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { getUserFromToken } from "@/utils/cookies";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        const authUser = getUserFromToken(req.cookies[config.JWT_COOKIE]);

        if (!authUser) {
            res.status(200).json({ data: { isLoggedIn: false } });
            return;
        }
        const session = Cookies.get(sessionCookie);
        try {
            const response = await fetch(
                `${apis.usersV1UrlIP}/${authUser?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            req.cookies[config.JWT_COOKIE]
                        }`,
                        [sessionHeader]: sessionPrefix + session,
                    },
                }
            );

            const json = await response.json();

            res.status(200).json({
                data: { isLoggedIn: true, user: json.data },
            });
        } catch (error) {
            throw new Error("We have been unable to log you in");
        }
    } catch (error) {
        const err = error as {
            response: {
                status: number;
                data?: { message: string };
            };
            stack: unknown;
            message: string;
        };
        if (err?.response) {
            res.status(err.response.status).send({
                title: "We have not been able to fetch your profile",
                message: err.response.data?.message,
            });
        } else {
            res.status(500).send({
                title: "We have not been able to fetch your profile",
                message: err.message,
                stack: err.stack,
            });
        }
    }
}
