import apis from "@/config/apis";
import config from "@/config/config";
import { postRequest } from "@/services/api/post";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await postRequest(apis.logoutV1Url, null, {
            notificationOptions: {
                errorNotificationsOn: false,
                successNotificationsOn: false,
            },
        });

        const cookie = serialize(config.JWT_COOKIE, "", {
            expires: new Date(0),
            path: "/",
        });
        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ message: "success" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        res.status(404).send({
            title: "We have not been able to log you out",
            message,
        });
    }
}
