import { userV1 } from "@/mocks/data";
import { rest } from "msw";
import { User } from "@/interfaces/User";

interface Response {
    data: User;
}

const getUserV1 = (data = userV1, status = 200) => {
    return rest.get("api/user", (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(ctx.status(status), ctx.json<Response>({ data }));
    });
};

export { getUserV1 };
