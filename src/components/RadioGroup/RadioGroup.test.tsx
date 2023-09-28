import { render, screen, waitFor } from "@/utils/testUtils";
import { useForm } from "react-hook-form";

// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from "@testing-library/user-event";
import Form from "@/components/Form";
import Button from "@/components/Button";
import RadioGroup from "./RadioGroup";

const submitFn = jest.fn();

describe("RadioGroup", () => {
    const label = "Radio Options";
    const radios = [
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "yellow", label: "Yellow" },
    ];

    const Component = (props: { [key: string]: unknown }) => {
        const { control, handleSubmit } = useForm({
            defaultValues: {
                color: "red",
            },
        });

        return (
            <Form onSubmit={handleSubmit(data => submitFn(data))}>
                <RadioGroup
                    name="color"
                    label={label}
                    radios={radios}
                    control={control}
                    {...props}
                />
                <Button type="submit">Submit</Button>
            </Form>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders radios with a label", () => {
        render(<Component />);

        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();

        radios.forEach(radio => {
            const radioElement = screen.getByText(radio.label);
            expect(radioElement).toBeInTheDocument();
        });
    });
    it("should submit updated value", async () => {
        render(<Component />);

        const radioOptions = screen.getAllByRole("radio");

        userEvent.click(radioOptions[1]);

        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(submitFn).toHaveBeenCalledWith({ color: "blue" });
        });
    });
});
