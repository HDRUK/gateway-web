import { rest } from "msw";
import apis from "@/config/apis";
import { CMSResponse } from "@/interfaces/Cms";
import { ReleaseNode } from "@/interfaces/Releases";

const getCMSReleaseV1 = (status = 200) => {
    return rest.post(apis.wordPressApiUrl, (req, res, ctx) => {
        if (status !== 200) {
            return res(
                ctx.status(status),
                ctx.json(`Request failed with status code ${status}`)
            );
        }
        return res(
            ctx.status(status),
            ctx.json<{ data: CMSResponse<ReleaseNode> }>({
                data: {
                    posts: {
                        edges: [
                            {
                                node: {
                                    title: "mock title 1",
                                    date: "2023-06-12T15:56:38",
                                    id: "1",
                                    content:
                                        "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                                },
                            },
                            {
                                node: {
                                    title: "mock title 2",
                                    date: "2022-06-12T15:56:38",
                                    id: "2",
                                    content:
                                        "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                                },
                            },
                            {
                                node: {
                                    title: "mock title 3",
                                    date: "2023-08-12T15:56:38",
                                    id: "3",
                                    content:
                                        "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                                },
                            },
                        ],
                    },
                },
            })
        );
    });
};

const CMSReleaseV1 = getCMSReleaseV1();

export { getCMSReleaseV1, CMSReleaseV1 };
