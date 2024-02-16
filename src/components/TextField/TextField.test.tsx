import { useForm } from "react-hook-form";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import TextField from "@/components/TextField";
import { render, screen } from "@/utils/testUtils";

describe("TextField", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const { control } = useForm();
        return (
            <TextField
                label="This is a label"
                name="fieldName"
                control={control}
                {...props}
            />
        );
    };
    it("should render label", async () => {
        render(<Component />);

        expect(screen.getByText("This is a label")).toBeInTheDocument();
    });
    it("should render placeholder", async () => {
        render(<Component placeholder="This is a placeholder" />);

        expect(
            screen.getByPlaceholderText("This is a placeholder")
        ).toBeInTheDocument();
    });
    it("should render info", async () => {
        render(<Component info="This is info" />);

        expect(screen.getByText("This is info")).toBeInTheDocument();
    });
    it("should render icon", async () => {
        const wrapper = render(<Component icon={AddAPhoto} />);

        expect(wrapper.container).toMatchSnapshot();
    });
    it("should throw Error if `showClearButton` set but not provided `setValue`", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() => {
            render(<Component showClearButton />);
        }).toThrowError(
            "You must pass `setValue` if you would like to show the clear button"
        );
    });
});
