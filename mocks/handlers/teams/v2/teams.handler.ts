import { rest } from "msw";
import { Dataset } from "@/interfaces/Dataset";
import { Team } from "@/interfaces/Team";
import apis from "@/config/apis";
import { datasetsV1 } from "@/mocks/data";
import { teamV1 } from "@/mocks/data/team";

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

export { getTeamV2, getTeamDatasetsV2 };
