import ProviderLinks from "@/modules/ProviderLinks";
import { render, screen } from "@/utils/testUtils";

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(
            <ProviderLinks showInstituion={() => console.log("test")} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(<ProviderLinks showInstituion={() => console.log("test")} />);

        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Google")).toBeInTheDocument();
    });
});
