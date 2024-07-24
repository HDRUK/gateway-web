import { rest } from "msw";
import apis from "@/config/apis";
import { DataUse } from "@/interfaces/DataUse";
import { generateDataUse } from "@/mocks/data/dataUse";
import { PaginationType } from "@/interfaces/Pagination";

const getDataUses = (data: DataUse[] = generateDataUse, status = 200) => {
    return rest.get(apis.dataUseV1Url, (req, res, ctx) => {
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
                ctx.json<PaginationType<DataUse>>({
                    lastPage: 5,
                    to: 5,
                    from: 1,
                    currentPage: 1,
                    total: 25,
                    list: data,
                })
            );
        }
        return res(ctx.status(status), ctx.json<{ data: DataUse[] }>({ data }));
    });
};

const getDataUse = (data: DataUse = generateDataUse, status = 200) => {
    return rest.get(`${apis.dataUseV1Url}/${data.id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<{ data: DataUse }>({ data }));
    });
};

export { getDataUses, getDataUse };
