import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { render, screen } from "@/utils/testUtils";
import DatePicker from "./DatePicker";

describe("DatePicker", () => {
    const Component = (props: { name: string; defaultValues?: unknown }) => {
        const { control } = useForm({
            defaultValues: props?.defaultValues || {},
        });
        return <DatePicker label="Pick a date" control={control} {...props} />;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders DatePicker with a label", () => {
        render(<Component name="dataFrom" />);
        expect(screen.getByText("Pick a date")).toBeInTheDocument();
    });

    it("renders DatePicker with a default value", () => {
        const defaultValues = { dateTo: dayjs(new Date("2020-01-01")) };
        render(<Component name="dateTo" defaultValues={defaultValues} />);
        const inputElement = screen.getByPlaceholderText(
            "DD/MM/YYYY"
        ) as HTMLInputElement;
        expect(inputElement.value).toBe("01/01/2020");
    });
});
