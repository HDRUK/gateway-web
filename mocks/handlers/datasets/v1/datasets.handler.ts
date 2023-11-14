import { rest } from "msw";
import apis from "@/config/apis";
import { Dataset } from "@/interfaces/Dataset";
import { datasetsV1 } from "@/mocks/data/dataset";
import { PaginationType } from "@/interfaces/Pagination";

const getDatasetsV1 = (data: Dataset[] = datasetsV1, status = 200) => {
    return rest.get(apis.datasetsV1Url, (req, res, ctx) => {
        const url = new URL(req.url);
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        if (url.searchParams.get("page")) {
            return res(
                ctx.status(status),
                ctx.json<PaginationType<Dataset>>({
                    lastPage: 5,
                    to: 5,
                    from: 1,
                    currentPage: 1,
                    total: 25,
                    list: data,
                })
            );
        }
        return res(ctx.status(status), ctx.json<{ data: Dataset[] }>({ data }));
    });
};

export { getDatasetsV1 };
