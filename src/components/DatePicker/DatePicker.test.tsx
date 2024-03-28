import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { render, screen } from "@/utils/testUtils";
import DatePicker from "./DatePicker";

describe("DatePicker", () => {
    const Component = (props: { defaultValues?: unknown }) => {
        const { control } = useForm({
            defaultValues: { date: props?.defaultValues || "" },
        });
        return <DatePicker label="Pick a date" name="date" control={control} />;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders DatePicker with a label", () => {
        render(<Component />);
        expect(screen.getByText("Pick a date")).toBeInTheDocument();
    });

    it("renders DatePicker with a default value", () => {
        const defaultValues = dayjs(new Date("2020-01-01"));
        render(<Component defaultValues={defaultValues} />);
        const inputElement = screen.getByPlaceholderText(
            "DD/MM/YYYY"
        ) as HTMLInputElement;
        expect(inputElement.value).toBe("01/01/2020");
    });
});
