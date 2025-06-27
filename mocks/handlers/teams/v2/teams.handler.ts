import { rest } from "msw";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
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

const getTeamToolV2 = (id: number, data = generateTool(), status = 200) => {
    return rest.get(`${apis.teamsV2Url}/1/tools/${id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(
            ctx.status(status),
            ctx.json<{
                data: Tool;
            }>({ data })
        );
    });
};

export { getTeamV2, getTeamDatasetsV2, getTeamDataUseV2, getTeamToolV2 };
