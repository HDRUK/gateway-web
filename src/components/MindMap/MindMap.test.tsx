import Accordion from "@/components/Accordion";
import { render, screen } from "@/utils/testUtils";

describe("Accordion", () => {
    const heading = "Accordion Summary";
    const contents = "Detail Contents";

    it("should render component", async () => {
        const wrapper = render(
            <Accordion heading={heading} contents={contents} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });

    it("displays the accordion summary correctly", () => {
        render(<Accordion heading={heading} contents={contents} />);

        expect(screen.getByText(heading)).toBeInTheDocument();
    });

    it("displays the detail contents correctly", () => {
        render(<Accordion heading={heading} contents={contents} />);

        expect(screen.getByText(contents)).toBeInTheDocument();
    });
});
