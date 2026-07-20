import { useForm } from "react-hook-form";
import { render, screen } from "@/utils/testUtils";
import Autocomplete from "./Autocomplete";

describe("Autocomplete", () => {
    const colors = [
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "yellow", label: "Yellow" },
    ];

    const WrapperComponent = () => {
        const { control } = useForm<{ fieldName: string }>();

        return (
            <Autocomplete
                control={control}
                label="Select an option"
                placeholder="Type here"
                name="fieldName"
                options={colors}
            />
        );
    };

    it("should render component", async () => {
        render(<WrapperComponent />);
        expect(screen.getByText("Select an option")).toBeInTheDocument();
    });
});
