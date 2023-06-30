import apis from "@/config/apis";
import { User } from "@/interfaces/User";
import { userV1 } from "@/mocks/data";
import { rest } from "msw";

interface Response {
    data: {
        user: User | undefined;
        isLoggedIn: boolean;
    };
}

const getAuthInternal = (data?: User | null, status = 200) => {
    const user = data === null ? undefined : userV1;
    return rest.get(apis.authInternalUrl, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<Response>({ data: { user, isLoggedIn: !!user } })
        );
    });
};

export { getAuthInternal };
