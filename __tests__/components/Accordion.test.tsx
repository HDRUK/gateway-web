import Accordion from "@/components/Accordion";
import { render, screen } from "../testUtils";

describe("Accordion", () => {
    const accordionHeading = "Accordion Summary";
    const detailContents = "Detail Contents";

    it("renders without crashing", () => {
        render(
            <Accordion
                accordionHeading={accordionHeading}
                detailContents={detailContents}
            />
        );
    });

    it("displays the accordion summary correctly", () => {
        render(
            <Accordion
                accordionHeading={accordionHeading}
                detailContents={detailContents}
            />
        );

        expect(screen.getByText(accordionHeading)).toBeInTheDocument();
    });

    it("displays the detail contents correctly", () => {
        render(
            <Accordion
                accordionHeading={accordionHeading}
                detailContents={detailContents}
            />
        );

        expect(screen.getByText(detailContents)).toBeInTheDocument();
    });
    it("should render component", async () => {
        const wrapper = render(
            <Accordion
                accordionHeading={accordionHeading}
                detailContents={detailContents}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
