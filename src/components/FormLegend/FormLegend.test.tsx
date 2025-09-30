import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { render, screen } from "@/utils/testUtils";
import FormLegend from "./FormLegend";

describe("FormLegend", () => {
    const data: LegendItem[] = [
        { name: "ITEM1", status: LegendStatus.VALID, count: "2" },
    ];

    it("should render legend", async () => {
        const wrapper = render(<FormLegend items={data} />);
        expect(wrapper.container).toMatchSnapshot();
    });

    it("should display item counts", () => {
        render(<FormLegend items={data} />);

        expect(screen.getByText("(2)")).toBeInTheDocument();
    });
});
