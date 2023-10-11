import { rest } from "msw";
import apis from "@/config/apis";
import { Application } from "@/interfaces/Application";
import { applicationV1, applicationsV1 } from "@/mocks/data/application";
import { PaginationType } from "@/interfaces/Pagination";

const getApplicationV1 = (data = applicationV1, status = 200) => {
    return rest.get(`${apis.applicationsV1Url}/${data.id}`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: Application }>({ data })
        );
    });
};

interface getApplicationsProps {
    data?: Application[];
    status?: number;
    pagination?: Omit<PaginationType<Application>, "list">;
}

const getApplicationsV1 = ({
    data = applicationsV1,
    status = 200,
    pagination,
}: getApplicationsProps) => {
    return rest.get(apis.applicationsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        if (pagination) {
            return res(
                ctx.status(status),
                ctx.json<PaginationType<Application>>({
                    list: data,
                    ...pagination,
                })
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: Application[] }>({ data })
        );
    });
};

const patchApplicationV1 = (data = applicationV1, status = 200) => {
    return rest.patch(`${apis.applicationsV1Url}/:id`, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: Application }>({ data })
        );
    });
};

export { getApplicationV1, getApplicationsV1, patchApplicationV1 };
