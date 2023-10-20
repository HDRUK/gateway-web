import { render, screen, waitFor } from "@/utils/testUtils";
import { useForm } from "react-hook-form";

// eslint-disable-next-line import/no-extraneous-dependencies
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
                selectedTime: "",
            },
        });

        return (
            <Form onSubmit={handleSubmit(data => submitFn(data))}>
                <TextTime
                    name="selectedTime"
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

        const selectOptions = screen.getAllByRole("button");

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
            expect(submitFn).toHaveBeenCalledWith({ selectedTime: "23: 59" });
        });
    });
    it("should use customUpdate to return custom response", async () => {
        render(
            <Component
                customUpdate={({ hours }: { hours: string }) =>
                    parseInt(hours, 10)
                }
            />
        );

        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(submitFn).toHaveBeenCalledWith({ selectedTime: 1 });
        });
    });
    it("should pass props and disable specified input", async () => {
        render(<Component minProps={{ disabled: true }} />);

        const [hourDropdown, minuteDropdown] = screen.getAllByRole("button");

        expect(hourDropdown).not.toHaveClass("Mui-disabled");
        expect(minuteDropdown).toHaveClass("Mui-disabled");
    });
});
