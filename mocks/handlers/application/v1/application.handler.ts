import { rest } from "msw";
import apis from "@/config/apis";
import { Application } from "@/interfaces/Application";
import { applicationV1, applicationsV1 } from "@/mocks/data/application";

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

const getApplicationsV1 = (data = applicationsV1, status = 200) => {
    return rest.get(apis.applicationsV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: Application[] }>({ data })
        );
    });
};

export { getApplicationV1, getApplicationsV1 };
