import { useForm } from "react-hook-form";
import { fireEvent, render, screen } from "@/utils/testUtils";
import FilterSection from "./FilterSection";

const filterItem = {
    buckets: [
        { value: "filter1", label: "filter 1", count: 5 },
        { value: "filter2", label: "filter 2", count: 10 },
    ],
    value: "1",
    label: "course 1",
};

describe("FilterSection", () => {
    const mockFn = jest.fn();
    const mockReset = jest.fn();

    const Component = ({
        checkboxValues = {},
        resetFilterSection = mockReset,
    }: {
        checkboxValues?: { [key: string]: boolean };
        resetFilterSection?: () => void;
    }) => {
        const { control, setValue } = useForm();
        return (
            <FilterSection
                checkboxValues={checkboxValues}
                handleCheckboxChange={mockFn}
                filterItem={filterItem}
                filterSection="course"
                setValue={setValue}
                control={control}
                countsDisabled={false}
                resetFilterSection={resetFilterSection}
            />
        );
    };

    it("should render component", () => {
        render(<Component />);
        expect(screen.getByText(5)).toBeInTheDocument();
        expect(screen.getByText("filter 1")).toBeInTheDocument();
    });

    it("should filter items and reset", () => {
        render(<Component />);

        const input = screen.getByPlaceholderText("I'm looking for...");
        fireEvent.change(input, { target: { value: "filter 1" } });
        expect(screen.getByText("filter 1")).toBeInTheDocument();
        expect(screen.queryByText("filter 2")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("CancelIcon"));
        expect(screen.queryByText("filter 2")).toBeInTheDocument();
    });

    it("calls resetFilterSection when the clear filter button is clicked with a checked item", () => {
        render(<Component checkboxValues={{ "filter 1": true }} />);

        // ClearFilterButton is enabled when at least one checkbox is checked
        const clearButton = screen.getByRole("button", { name: /\(1\)/ });
        fireEvent.click(clearButton);

        expect(mockReset).toHaveBeenCalled();
    });
});
