import { rest } from "msw";
import { CMSPostResponse } from "@/interfaces/Cms";
import { ReleaseNode } from "@/interfaces/Releases";
import apis from "@/config/apis";
import { releaseV1 } from "@/mocks/data/cms";

const getCMSReleaseV1 = (data = releaseV1, status = 200) => {
    return rest.post(apis.wordPressApiUrl, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: CMSPostResponse<ReleaseNode> }>({
                data,
            })
        );
    });
};

export { getCMSReleaseV1 };
