import { rest } from "msw";
import config from "@/config";
import { Tag } from "@/interfaces/Tag";
import { tagsV1 } from "@/mocks/data";

interface Response {
    data: Tag[];
}

const getTagsV1 = (data = tagsV1, status = 200) => {
    return rest.get(config.tagsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<Response>({ data }));
    });
};

export { getTagsV1 };
