import { rest } from "msw";
import apis from "@/config/apis";
import { Integration } from "@/interfaces/Integration";
import { PaginationType } from "@/interfaces/Pagination";
import { integrationV1, integrationsV1 } from "@/mocks/data/integration";

interface getIntegrationsProps {
    data?: Integration[];
    teamId?: number;
    status?: number;
    pagination?: Omit<PaginationType<Integration>, "list">;
}

const getIntegrationsV1 = ({
    data = integrationsV1,
    teamId = 1,
    status = 200,
    pagination,
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
            if (pagination) {
                return res(
                    ctx.status(status),
                    ctx.json<PaginationType<Integration>>({
                        list: data,
                        ...pagination,
                    })
                );
            }
            return res(
                ctx.status(status),
                ctx.json<{ data: Integration[] }>({ data })
            );
        }
    );
};

interface PostResponse {
    data: Integration;
}

const postIntegrationV1 = ({
    data = integrationV1,
    teamId = 1,
    status = 200,
}) => {
    return rest.post(
        `${apis.teamsV1Url}/${teamId}/federations`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }
            return res(ctx.status(status), ctx.json<PostResponse>({ data }));
        }
    );
};

export { getIntegrationsV1, postIntegrationV1 };
