import vars from "@/config/vars";
import { postRequest } from "@/services/api/post";
import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_COOKIE = "token";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await postRequest(vars.logoutV1Url, null, {
        notificationOptions: {
            notificationsOn: false,
        },
    });

    deleteCookie(JWT_COOKIE, { req, res });

    res.status(200).json({ message: "success" });
}
