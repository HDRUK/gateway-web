import { render, screen, waitFor } from "@/utils/testUtils";
import { useForm } from "react-hook-form";

import userEvent from "@testing-library/user-event";
import Form from "@/components/Form";
import Button from "@/components/Button";
import TextTime from "./TextTime";

const submitFn = jest.fn();

describe("TextTime", () => {
    const label = "Select Time";

    const Component = (props: { [key: string]: unknown }) => {
        const { control, handleSubmit } = useForm({
            defaultValues: {
                selectedHour: "",
                selectedMinute: "",
            },
        });

        return (
            <Form onSubmit={handleSubmit(data => submitFn(data))}>
                <TextTime
                    name={{ hour: "selectedHour", minute: "selectedMinute" }}
                    label={label}
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

    it("renders input with a label", () => {
        render(<Component />);

        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
    });
    it("should submit updated value", async () => {
        render(<Component />);

        const selectOptions = screen.getAllByRole("combobox");

        userEvent.click(selectOptions[0]);

        await waitFor(() => {
            expect(screen.getByText("23")).toBeInTheDocument();
        });

        userEvent.click(screen.getByText("23"));

        userEvent.click(selectOptions[1]);

        await waitFor(() => {
            expect(screen.getByText("59")).toBeInTheDocument();
        });

        userEvent.click(screen.getByText("59"));

        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(submitFn).toHaveBeenCalledWith({
                selectedHour: "23",
                selectedMinute: "59",
            });
        });
    });
    it("should pass props and disable specified input", async () => {
        render(<Component minProps={{ disabled: true }} />);

        const [hourDropdown, minuteDropdown] = screen.getAllByRole("combobox");

        expect(hourDropdown).not.toHaveClass("Mui-disabled");
        expect(minuteDropdown).toHaveClass("Mui-disabled");
    });
});
