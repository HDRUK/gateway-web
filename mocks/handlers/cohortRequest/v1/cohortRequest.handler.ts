import { rest } from "msw";
import apis from "@/config/apis";
import { PaginationType } from "@/interfaces/Pagination";
import { cohortRequestsV1 } from "@/mocks/data/cohortRequest";
import { CohortRequest } from "@/interfaces/CohortRequest";

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

export { getCohortRequestsV1 };
