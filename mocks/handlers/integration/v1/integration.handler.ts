import { rest } from "msw";
import apis from "@/config/apis";
import { Integration } from "@/interfaces/Integration";
import { PaginationType } from "@/interfaces/Pagination";
import { generateIntegrationsV1 } from "@/mocks/data/integration";

interface getIntegrationsProps {
    data?: Integration[];
    teamId?: number;
    status?: number;
}

const getIntegrationsV1 = ({
    data,
    teamId = 1,
    status = 200,
}: getIntegrationsProps) => {

    return rest.get(
        `${apis.teamsV1Url}/${teamId}/federations`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }
            return res(
                ctx.status(status),
                ctx.json<{ data: PaginationType<Integration> }>(
                    { 
                        list: data,
                        lastPage: 1,
                        total: data?.length 
                    })
            );
        }
    );
};

export { getIntegrationsV1 };
