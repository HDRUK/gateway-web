import { render, screen, waitFor } from "@/utils/testUtils";
import { homepageBannerV1 } from "@/mocks/data/cms";
import CMSBanners from "./CMSBanners";

jest.mock("@/utils/cms", () => ({
    getHomePageBanner: () => Promise.resolve(homepageBannerV1.posts.edges),
}));

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
            render(<CMSBanners />);

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
