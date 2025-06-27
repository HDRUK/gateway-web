import { rest } from "msw";
import { PaginationType } from "@/interfaces/Pagination";
import { Tool } from "@/interfaces/Tool";
import apis from "@/config/apis";
import { generateTool, generateTools } from "@/mocks/data/tool";

const getTools = (data: Tool[] = generateTools(), status = 200) => {
    return rest.get(`${apis.teamsV2Url}/1/tools`, (req, res, ctx) => {
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
                ctx.json<PaginationType<Tool>>({
                    lastPage: 5,
                    to: 5,
                    from: 1,
                    currentPage: 1,
                    total: 25,
                    list: data,
                })
            );
        }
        return res(ctx.status(status), ctx.json<{ data: Tool[] }>({ data }));
    });
};

const getTool = (data: Tool = generateTool(), status = 200) => {
    return rest.get(
        `${apis.teamsV2Url}/1/tools/${data.id}`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }
            return res(ctx.status(status), ctx.json<{ data: Tool }>({ data }));
        }
    );
};

export { getTool, getTools };
