import apis from "@/config/apis";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/utils/cookies";
import http from "@/utils/http";
import config from "@/config/config";
import { AxiosError } from "axios";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.cookies: ", req.cookies);
    try {
        const authUser = getUserFromToken(req.cookies[config.JWT_COOKIE]);

        if (!authUser) {
            res.status(200).json({ data: { isLoggedIn: false } });
            return;
        }

        const { data: user } = await http.get(
            `${apis.usersV1UrlIP}/${authUser?.id}`,
            {
                headers: {
                    Authorization: `Bearer ${req.cookies[config.JWT_COOKIE]}`,
                },
                withCredentials: false,
            }
        );

        res.status(200).json({
            data: { isLoggedIn: true, user: user.data },
        });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
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
