import { rest } from "msw";
import apis from "@/config/apis";
import { Dataset } from "@/interfaces/Dataset";
import { datasetsV1 } from "@/mocks/data/dataset";

interface Response {
    data: Dataset[];
}

const getDatasetsV1 = (data = datasetsV1, status = 200) => {
    return rest.get(apis.datasetsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(ctx.status(status), ctx.json<Response>({ data }));
    });
};

export { getDatasetsV1 };
