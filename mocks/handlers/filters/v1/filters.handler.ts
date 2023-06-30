import { rest } from "msw";
import apis from "@/config/apis";
import { Filter } from "@/interfaces/Filter";
import { filtersV1, filterV1 } from "@/mocks/data";
import { errorResponseV1 } from "@/mocks/data/api/v1";

interface GetResponse {
    data: Filter[];
}

const getFiltersV1 = (data = filtersV1, status = 200) => {
    return rest.get(apis.filtersV1Url, (req, res, ctx) => {
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
    return rest.post(apis.filtersV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<PostResponse>({ data }));
    });
};

interface PutResponse {
    data: Filter;
}

const putFilterV1 = (data = filterV1, status = 200) => {
    return rest.put(`${apis.filtersV1Url}/:id`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<PutResponse>({ data }));
    });
};

interface DeleteResponse {
    message: string;
}

const deleteFilterV1 = (status = 200) => {
    return rest.delete(`${apis.filtersV1Url}/:id`, (req, res, ctx) => {
        if (status !== 200) {
            return res(ctx.status(status), ctx.json(errorResponseV1(status)));
        }
        return res(
            ctx.status(status),
            ctx.json<DeleteResponse>({ message: "success" })
        );
    });
};

export { getFiltersV1, postFilterV1, putFilterV1, deleteFilterV1 };
