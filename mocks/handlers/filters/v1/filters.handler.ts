import { rest } from "msw";
import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { filtersV1, filterV1 } from "@/mocks/data";

interface GetResponse {
    data: Filter[];
}

const getFiltersV1 = (data = filtersV1, status = 200) => {
    return rest.get(config.filtersV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<GetResponse>({ data }));
    });
};

interface PostResponse {
    data: Filter;
}

const postFilterV1 = (data = filterV1, status = 200) => {
    return rest.post(config.filtersV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<PostResponse>({ data }));
    });
};

export { getFiltersV1, postFilterV1 };
