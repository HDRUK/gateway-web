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

    it("gives the region a unique accessible name when an id is provided", () => {
        render(
            <Accordion
                id="anchor1"
                heading={heading}
                contents={contents}
                defaultExpanded
            />
        );

        const region = screen.getByRole("region");
        expect(region).toHaveAttribute("aria-labelledby", "anchor1-header");
        expect(region).toHaveAttribute("id", "anchor1-content");
        expect(region).toHaveAccessibleName(heading);
        expect(screen.getByRole("button", { name: heading })).toHaveAttribute(
            "id",
            "anchor1-header"
        );
    });

    it("displays accordion arrow icon on left", async () => {
        const wrapper = render(
            <Accordion heading={heading} contents={contents} iconLeft />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
