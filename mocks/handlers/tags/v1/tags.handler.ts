import config from "@/config";
import { User } from "@/interfaces";
import { userV1 } from "@/mocks/data";
import { rest } from "msw";

const getTagsV1 = (data = userV1, status = 200) => {
    return rest.get(config.tagsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(ctx.status(status), ctx.json<User>(data));
    });
};

export { getTagsV1 };
