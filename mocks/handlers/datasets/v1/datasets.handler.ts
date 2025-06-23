import { rest } from "msw";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import apis from "@/config/apis";
import { datasetsV1, datasetV1 } from "@/mocks/data/dataset";

const getDatasetsV1 = (data: Dataset[] = datasetsV1, status = 200) => {
    return rest.get(apis.datasetsV2Url, (req, res, ctx) => {
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

const getDatasetV1 = (data: Dataset = datasetV1, status = 200) => {
    return rest.get(`${apis.datasetsV2Url}/${data.id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<{ data: Dataset }>({ data }));
    });
};

export { getDatasetsV1, getDatasetV1 };
