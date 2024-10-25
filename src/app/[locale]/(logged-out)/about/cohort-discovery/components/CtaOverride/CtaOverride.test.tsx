import { render, screen } from "@/utils/testUtils";
import CtaOverride, { DATA_TEST_ID } from "./CtaOverride";

const MOCK_CTA_LINK = {
    target: "_blank",
    url: "www.url.com",
    title: "CTA TITLE",
};

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ isLoggedIn: true }),
}));

describe("CtaOverride", () => {
    it("should display cta link title text", () => {
        render(<CtaOverride ctaLink={MOCK_CTA_LINK} />);
        expect(screen.getByTestId(DATA_TEST_ID)).toBeInTheDocument();
    });

    // it("should navigate to cta url if logged in", async () => {
    //     render(<CtaOverride ctaLink={MOCK_CTA_LINK} />);
    //     userEvent.click(screen.getByTestId(DATA_TEST_ID));

    //     await waitFor(() => {
    //         expect(mockRouter.route).toBe(`/${MOCK_CTA_LINK.url}`);
    //     });
    // });
});
