import apis from "@/config/apis";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/utils/cookies";
import http from "@/utils/http";
import config from "@/config/config";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
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
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        res.status(404).send({
            title: "We have not been able to fetch your profile",
            message,
        });
    }
}
