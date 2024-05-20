import { render, screen } from "@/utils/testUtils";
import FilterSectionRadio from "./FilterSectionRadio";

describe("FilterSectionRadio", () => {
    const mockFn = jest.fn();

    const Component = () => {
        return (
            <FilterSectionRadio
                handleRadioChange={mockFn}
                filterItem={{
                    buckets: [
                        {
                            value: "FED",
                            label: "Search Europe PMC",
                        },
                        {
                            value: "GAT",
                            label: "Search Gateway",
                        },
                    ],
                    label: "source",
                    value: "",
                }}
            />
        );
    };
    it("should render component", () => {
        render(<Component />);
        expect(screen.getByText("Search Europe PMC")).toBeInTheDocument();
    });
});
