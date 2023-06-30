import { rest } from "msw";
import apis from "@/config/apis";

interface Response {
    message: string;
}

const getLogoutV1 = (status = 200) => {
    return rest.get(apis.logoutV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(
            ctx.status(status),
            ctx.json<Response>({ message: "success" })
        );
    });
};

export { getLogoutV1 };
