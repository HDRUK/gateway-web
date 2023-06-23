import vars from "@/config/vars";
import { rest } from "msw";

interface Response {
    message: string;
}

const getLogoutInternal = (status = 200) => {
    return rest.get(vars.logoutInternalUrl, (req, res, ctx) => {
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
