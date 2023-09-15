import { rest } from "msw";
import apis from "@/config/apis";
import { Team } from "@/interfaces/Team";
import { teamV1 } from "@/mocks/data/team";

interface Response {
    data: Team;
}

const getTeamV1 = (data = teamV1, status = 200) => {
    return rest.get(`${apis.teamsV1Url}/${data.id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }

        return res(ctx.status(status), ctx.json<Response>({ data }));
    });
};

export { getTeamV1 };
