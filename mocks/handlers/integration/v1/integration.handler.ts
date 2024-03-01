import { rest } from "msw";
import { FederationRunResponse } from "@/interfaces/Federation";
import { Integration } from "@/interfaces/Integration";
import { PaginationType } from "@/interfaces/Pagination";
import apis from "@/config/apis";
import {
    federationsResponseV1,
    integrationV1,
    integrationsV1,
} from "@/mocks/data/integration";
import { teamV1 } from "@/mocks/data/team";

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

interface getIntegrationProps {
    data?: Integration;
    teamId?: string;
    status?: number;
}

const getIntegrationV1 = ({
    data = integrationV1,
    teamId = teamV1.id,
    status = 200,
}: getIntegrationProps) => {
    return rest.get(
        `${apis.teamsV1Url}/${teamId}/federations/${data.id}`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }
            return res(
                ctx.status(status),
                ctx.json<{ data: Integration }>({ data })
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

interface PostFedResponse {
    data: FederationRunResponse;
}

const postFederationsTestV1 = ({
    data = federationsResponseV1,
    teamId = teamV1.id,
    status = 200,
}) => {
    return rest.post(
        `${apis.teamsV1Url}/${teamId}/federations/test`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }

            return res(ctx.status(status), ctx.json<PostFedResponse>({ data }));
        }
    );
};

export {
    getIntegrationV1,
    getIntegrationsV1,
    postIntegrationV1,
    postFederationsTestV1,
};
