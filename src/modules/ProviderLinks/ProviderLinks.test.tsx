import { render, screen } from "@/utils/testUtils";

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(<div></div>);

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(<div></div>);

        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Google")).toBeInTheDocument();
    });
});
