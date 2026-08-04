import { rest } from "msw";
import { FederationTestResponse } from "@/interfaces/Federation";
import { Integration } from "@/interfaces/Integration";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import { PaginationType } from "@/interfaces/Pagination";
import apis from "@/config/apis";
import {
    federationTestResponseV1,
    integrationHistoriesV1,
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
    teamId = teamV1.id.toString(),
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
    data: FederationTestResponse;
}

const postFederationsTestV1 = ({
    data = federationTestResponseV1,
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

interface getFederationRunProps {
    teamId?: number;
    federationId?: number;
    status?: number;
}

const getFederationRunV1 = ({
    teamId = teamV1.id,
    federationId = integrationV1.id,
    status = 200,
}: getFederationRunProps = {}) => {
    return rest.get(
        `${apis.teamsV1Url}/${teamId}/federations/${federationId}/run`,
        (req, res, ctx) => {
            if (status !== 200) {
                return res(
                    ctx.status(status),
                    ctx.json(`Request failed with status code ${status}`)
                );
            }

            return res(ctx.status(status), ctx.json({ message: "OK" }));
        }
    );
};

interface getFederationHistoryProps {
    data?: IntegrationHistory[];
    teamId?: number;
    federationId?: number;
    status?: number;
    pagination?: Omit<PaginationType<IntegrationHistory>, "list">;
}

const getFederationHistoryV1 = ({
    data = integrationHistoriesV1,
    teamId = teamV1.id,
    federationId = integrationV1.id,
    status = 200,
    pagination,
}: getFederationHistoryProps = {}) => {
    return rest.get(
        `${apis.teamsV1Url}/${teamId}/federations/${federationId}/history`,
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
                    ctx.json<PaginationType<IntegrationHistory>>({
                        list: data,
                        ...pagination,
                    })
                );
            }
            return res(
                ctx.status(status),
                ctx.json<{ data: IntegrationHistory[] }>({ data })
            );
        }
    );
};

export {
    getIntegrationV1,
    getIntegrationsV1,
    postIntegrationV1,
    postFederationsTestV1,
    getFederationRunV1,
    getFederationHistoryV1,
};
