import { render, screen } from "@/utils/testUtils";
import ProviderLinks from "./ProviderLinks";

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(
            <ProviderLinks showInstituion={() => console.log("show inst")} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(
            <ProviderLinks showInstituion={() => console.log("show inst")} />
        );

        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Google")).toBeInTheDocument();
    });
});
