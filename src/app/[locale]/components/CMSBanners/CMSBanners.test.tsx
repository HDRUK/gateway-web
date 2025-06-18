import { render, screen, waitFor } from "@/utils/testUtils";
import { homepageBannerV1 } from "@/mocks/data/cms";
import CMSBanners from "./CMSBanners";

const processEnv = { ...process.env };

describe("CMSBanners", () => {
    beforeAll(() => {
        process.env.NEXT_PUBLIC_INCLUDE_BANNERS = "true";
    });

    afterAll(() => {
        process.env = processEnv;
    });

    it.each(homepageBannerV1.posts.edges)(
        "$node.homepageBanner.heading has the correct content",
        async item => {
            render(<CMSBanners data={homepageBannerV1.posts.edges} />);

            await waitFor(() =>
                expect(
                    screen.getByText(item.node.homepageBanner.heading as string)
                ).toBeInTheDocument()
            );

            await waitFor(() =>
                expect(
                    screen.getByText(
                        item.node.homepageBanner.description as string
                    )
                ).toBeInTheDocument()
            );

            await waitFor(() =>
                expect(
                    screen.getByText(
                        item.node.homepageBanner.linkText as string
                    )
                ).toBeInTheDocument()
            );

            await waitFor(() => {
                const link = screen.getByText(
                    item.node.homepageBanner.linkText as string
                );

                expect(link.getAttribute("href")).toBeTruthy();
            });
        }
    );
});
