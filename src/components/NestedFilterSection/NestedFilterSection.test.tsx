import { useForm } from "react-hook-form";
import { fireEvent, render, screen } from "@/utils/testUtils";
import NestedFilterSection from "./NestedFilterSection";

describe("NestedFilterSection", () => {
    const mockFn = jest.fn();

    const Component = () => {
        const { control, setValue } = useForm();
        return (
            <NestedFilterSection
                checkboxValues={{}}
                handleCheckboxChange={mockFn}
                filterItem={{
                    buckets: [
                        {
                            value: "filter 1",
                            label: "filter 1",
                            count: 5,
                            subBuckets: [
                                {
                                    label: "subBucket 1",
                                    value: "subBucket1",
                                },
                                {
                                    label: "subBucket 3",
                                    value: "subBucket3",
                                },
                            ],
                        },
                        {
                            value: "filter 2",
                            label: "filter 2",
                            count: 10,
                        },
                    ],
                    value: "1",
                    label: "course 1",
                }}
                filterSection="course"
                setValue={setValue}
                control={control}
                counts={{ "filter 1": 4, "filter 2": 7 }}
                nestedCounts={{ "subBucket 1": 2, "subBucket 2": 1 }}
            />
        );
    };
    it("should render component", () => {
        render(<Component />);
        expect(screen.getByText("filter 1")).toBeInTheDocument();
    });
    it("should filter items and reset", () => {
        render(<Component />);

        const input = screen.getByPlaceholderText("I'm looking for...");
        fireEvent.change(input, { target: { value: "filter 1" } });
        expect(screen.getByText("filter 1")).toBeInTheDocument();
        expect(screen.queryByText("filter 2")).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: "sub" } });
        expect(screen.getByText("filter 1")).toBeInTheDocument();
        expect(screen.queryByText("filter 2")).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: "2" } });
        expect(screen.queryByText("filter 1")).not.toBeInTheDocument();
        expect(screen.getByText("filter 2")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("CancelIcon"));
        expect(screen.queryByText("filter 2")).toBeInTheDocument();
    });
});
