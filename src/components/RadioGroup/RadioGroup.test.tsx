import { render, screen } from "@/utils/testUtils";
import { useForm } from "react-hook-form";
import RadioGroup from "./RadioGroup";

describe("RadioGroup", () => {
    it("renders radios with a label", () => {
        const label = "Select Options";
        const radios = [
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
                <RadioGroup
                    name="colors"
                    label={label}
                    radios={radios}
                    control={control}
                    {...props}
                />
            );
        };

        render(<Component />);

        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();

        radios.forEach(radio => {
            const radioElement = screen.getByText(radio.label);
            expect(radioElement).toBeInTheDocument();
        });
    });
});
