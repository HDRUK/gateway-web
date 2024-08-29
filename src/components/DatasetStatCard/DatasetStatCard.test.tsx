import { render, screen } from "@/utils/testUtils";
import DatasetStatCard, { DatasetStatCardProps } from "./DatasetStatCard";

const renderTest = (props?: Partial<DatasetStatCardProps>) =>
    render(
        <DatasetStatCard
            iconSrc="/test.jpg"
            title="A description"
            stat="10"
            largeStatText
            unit="days"
            helperText="helper"
            noStatText="Fallback text"
            {...props}
        />
    );

describe("DatasetStatCard", () => {
    it("should match snapshot", async () => {
        const wrapper = renderTest();

        expect(wrapper.container).toMatchSnapshot();
    });

    it("shows no stat fallback text", async () => {
        renderTest({
            stat: "",
        });

        expect(screen.getByText("Fallback text")).toBeInTheDocument();
    });
});
