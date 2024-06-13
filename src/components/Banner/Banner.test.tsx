import Banner from "@/components/Banner";
import { render, screen } from "@/utils/testUtils";

describe("Banner", () => {
    it("should render component", async () => {
        render(
            <Banner
                title="mock title"
                subTitle="mock sub title"
                src="/images/banners/release-notes.png"
            />
        );

        expect(screen.getByAltText("mock title")).toBeInTheDocument();
        expect(screen.getByText("mock title")).toBeInTheDocument();
        expect(screen.getByText("mock sub title")).toBeInTheDocument();
    });
});
