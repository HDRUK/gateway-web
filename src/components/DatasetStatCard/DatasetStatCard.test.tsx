import { render } from "@/utils/testUtils";
import DatasetStatCard from "./DatasetStatCard";

describe("DatasetInfoCard", () => {
    it("should match snapshot", async () => {
        const img = "/test.jpg";
        const title = "A description";
        const stat = "10";
        const unit = "days";
        const helperText = "helper";

        const wrapper = render(
            <DatasetStatCard
                iconSrc={img}
                title={title}
                stat={stat}
                largeStatText
                unit={unit}
                helperText={helperText}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
