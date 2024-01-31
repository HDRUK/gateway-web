import { useForm } from "react-hook-form";
import { fireEvent, render, screen } from "@/utils/testUtils";
import FilterSection from "./FilterSection";

describe("FilterSection", () => {
    const Component = () => {
        const { control, setValue } = useForm();
        return (
            <FilterSection
                filterItems={[
                    { value: "1", label: "course 1" },
                    { value: "2", label: "course 2" },
                ]}
                filterSection="course"
                setValue={setValue}
                control={control}
            />
        );
    };
    it("should render component", () => {
        render(<Component />);
        expect(screen.getByText("course 1")).toBeInTheDocument();
        expect(screen.getByText("course 2")).toBeInTheDocument();
    });
    it("should filter items and reset", () => {
        render(<Component />);

        const input = screen.getByPlaceholderText("I'm looking for...");
        fireEvent.change(input, { target: { value: "course 1" } });
        expect(screen.getByText("course 1")).toBeInTheDocument();
        expect(screen.queryByText("course 2")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("CancelIcon"));
        expect(screen.queryByText("course 2")).toBeInTheDocument();
    });
});
