import Accordion from "@/components/Accordion";
import { render, screen } from "../testUtils";

describe("Accordion", () => {
    const heading = "Accordion Summary";
    const contents = "Detail Contents";

    it("renders without crashing", () => {
        render(<Accordion heading={heading} contents={contents} />);
    });

    it("displays the accordion summary correctly", () => {
        render(<Accordion heading={heading} contents={contents} />);

        expect(screen.getByText(heading)).toBeInTheDocument();
    });

    it("displays the detail contents correctly", () => {
        render(<Accordion heading={heading} contents={contents} />);

        expect(screen.getByText(contents)).toBeInTheDocument();
    });
    it("should render component", async () => {
        const wrapper = render(
            <Accordion heading={heading} contents={contents} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
