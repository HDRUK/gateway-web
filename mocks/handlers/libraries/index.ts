import { rest } from "msw";
import { Library } from "@/interfaces/Library";
import apis from "@/config/apis";

const getLibrariesV1 = (data: Library[] = [], status = 200) => {
    return rest.get(apis.librariesV1Url, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(ctx.status(status), ctx.json<{ data: Library[] }>({ data }));
    });
};

export { getLibrariesV1 };
