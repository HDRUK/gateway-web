import { render, screen } from "@/utils/testUtils";
import { useForm } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";

describe("CheckboxGroup", () => {
    it("renders checkboxes with a label", () => {
        const label = "Select Options";
        const checkboxes = [
            { value: "red", label: "Option 1" },
            { value: "blue", label: "Option 2" },
            { value: "yellow", label: "Option 3" },
        ];

        const Component = (props: { [key: string]: unknown }) => {
            const { control } = useForm({
                defaultValues: {
                    colors: {
                        red: true,
                        blue: true,
                    },
                },
            });

            return (
                <CheckboxGroup
                    name="colors"
                    label={label}
                    checkboxes={checkboxes}
                    control={control}
                    {...props}
                />
            );
        };

        render(<Component />);

        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();

        checkboxes.forEach(checkbox => {
            const checkboxElement = screen.getByText(checkbox.label);
            expect(checkboxElement).toBeInTheDocument();
        });
    });
});
