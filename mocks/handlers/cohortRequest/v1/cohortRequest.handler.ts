import { rest } from "msw";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { PaginationType } from "@/interfaces/Pagination";
import apis from "@/config/apis";
import { cohortRequestsV1, cohortRequestV1 } from "@/mocks/data/cohortRequest";

const getCohortRequestsV1 = (
    data: CohortRequest[] = cohortRequestsV1,
    status = 200
) => {
    return rest.get(apis.cohortRequestsV1Url, (req, res, ctx) => {
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
                ctx.json<PaginationType<CohortRequest>>({
                    lastPage: 5,
                    to: 5,
                    from: 1,
                    currentPage: 1,
                    total: 25,
                    list: data,
                })
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: CohortRequest[] }>({ data })
        );
    });
};

const postCohortRequestV1 = (data = cohortRequestV1, status = 200) => {
    return rest.post(apis.cohortRequestsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: CohortRequest }>({ data })
        );
    });
};

export { getCohortRequestsV1, postCohortRequestV1 };
