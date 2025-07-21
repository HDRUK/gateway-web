import { rest } from "msw";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import { Team } from "@/interfaces/Team";
import { Tool } from "@/interfaces/Tool";
import apis from "@/config/apis";
import { datasetsV1, generateDataUse } from "@/mocks/data";
import { teamV1 } from "@/mocks/data/team";
import { generateTool } from "@/mocks/data/tool";

interface Response {
    data: Team;
}

const getTeamV2 = (data = teamV1, status = 200) => {
    return rest.get(`${apis.teamsV2Url}/${data.id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(ctx.status(status), ctx.json<Response>({ data }));
    });
};

const getTeamDatasetsV2 = (data = datasetsV1, status = 200) => {
    return rest.get(
        `${apis.teamsV2Url}/1/datasets/status/active`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }

            return res(
                ctx.status(status),
                ctx.json<{
                    data: Dataset[];
                }>({ data })
            );
        }
    );
};

const getTeamDataUseV2 = (
    id: number,
    data = generateDataUse(),
    status = 200
) => {
    return rest.get(`${apis.teamsV2Url}/1/dur/${id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(
            ctx.status(status),
            ctx.json<{
                data: DataUse;
            }>({ data })
        );
    });
};

const getTeamDataUsesV2 = (
    overrides: Partial<DataUse>[] = [],
    status = 200,
    teamId = 1,
    dataLength = 5
) => {
    const data: DataUse[] = overrides.length
        ? overrides.map(override => ({ ...generateDataUse(), ...override }))
        : Array.from({ length: dataLength }, () => generateDataUse());

    return rest.get(
        `${apis.teamsV2Url}/${teamId}/dur/status/active`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }

            if (req.url.searchParams.get("page")) {
                return res(
                    ctx.status(status),
                    ctx.json<PaginationType<DataUse>>({
                        lastPage: 5,
                        to: 5,
                        from: 1,
                        currentPage: 1,
                        total: dataLength,
                        list: data,
                    })
                );
            }

            return res(
                ctx.status(status),
                ctx.json<{ data: DataUse[] }>({ data })
            );
        }
    );
};

const getTeamToolsV2 = (
    overrides: Partial<Tool>[] = [],
    status = 200,
    teamId = 1,
    dataLength = 5
) => {
    const data: Tool[] = overrides.length
        ? overrides.map(override => ({ ...generateTool(), ...override }))
        : Array.from({ length: dataLength }, () => generateTool());

    return rest.get(`${apis.teamsV2Url}/${teamId}/tools`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        if (req.url.searchParams.get("page")) {
            return res(
                ctx.status(status),
                ctx.json<PaginationType<Tool>>({
                    lastPage: 5,
                    to: 5,
                    from: 1,
                    currentPage: 1,
                    total: dataLength,
                    list: data,
                })
            );
        }
        return res(ctx.status(status), ctx.json<{ data: Tool[] }>({ data }));
    });
};

const getTeamToolV2 = (
    overrides: Partial<Tool> = {},
    status = 200,
    teamId = 1
) => {
    const data = { ...generateTool(), ...overrides };

    return rest.get(
        `${apis.teamsV2Url}/${teamId}/tools/${data.id}`,
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

export {
    getTeamV2,
    getTeamDatasetsV2,
    getTeamDataUseV2,
    getTeamDataUsesV2,
    getTeamToolV2,
    getTeamToolsV2,
};
