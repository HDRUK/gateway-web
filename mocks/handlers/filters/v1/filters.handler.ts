import { rest } from "msw";
import { Filter } from "@/interfaces/Filter";
import { PaginationType } from "@/interfaces/Pagination";
import apis from "@/config/apis";
import { FILTERS_PER_PAGE } from "@/config/request";
import { filtersV1, filterV1 } from "@/mocks/data";
import { errorResponseV1 } from "@/mocks/data/api/v1";

interface GetResponse {
    data: Filter[];
}

const getFiltersV1 = (data = filtersV1, status = 200) => {
    return rest.get(
        `${apis.filtersV1Url}`,
        (req, res, ctx) => {
            const url = new URL(req.url);
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json({
                        message: `Request failed with status code ${status}`,
                    })
                );
            }
            if (url.searchParams.get("perPage")) {
                return res(
                    ctx.status(status),
                    ctx.json<PaginationType<GetResponse>>({
                        lastPage: 5,
                        to: 5,
                        from: 1,
                        currentPage: 1,
                        total: 25,
                        list: data,
                    })
                );
            }
            return res(ctx.status(status), ctx.json<GetResponse>({ data }));
        }
    );
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
            return res(ctx.status(status), ctx.json(errorResponseV1()));
        }
        return res(
            ctx.status(status),
            ctx.json<DeleteResponse>({ message: "success" })
        );
    });
};

export { getFiltersV1, postFilterV1, putFilterV1, deleteFilterV1 };
