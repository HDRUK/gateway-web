import apis from "@/config/apis";
import { rest } from "msw";

interface Response {
    message: string;
}

const getLogoutInternal = (status = 200) => {
    return rest.get(apis.logoutInternalUrl, (req, res, ctx) => {
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

export { getLogoutInternal };
