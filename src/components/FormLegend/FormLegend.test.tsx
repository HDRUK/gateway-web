import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { render } from "@/utils/testUtils";
import FormLegend from "./FormLegend";

describe("FormLegend", () => {
    const data: LegendItem[] = [{ name: "ITEM1", status: LegendStatus.VALID }];

    it("should render legend", async () => {
        const wrapper = render(<FormLegend items={data} />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
