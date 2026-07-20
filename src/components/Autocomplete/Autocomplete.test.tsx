import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { render, screen, waitFor } from "@/utils/testUtils";
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

    const FreeSoloWrapperComponent = ({ format }: { format?: string }) => {
        const { control } = useForm<{ fieldName: string[] }>({
            defaultValues: { fieldName: [] },
        });

        return (
            <Autocomplete
                control={control}
                label="Add tools"
                placeholder="Type here"
                name="fieldName"
                freeSolo
                multiple
                canCreate
                format={format}
            />
        );
    };

    it("should render component", async () => {
        render(<WrapperComponent />);
        expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("should reject an invalid value and show an error when format is url", async () => {
        render(<FreeSoloWrapperComponent format="url" />);

        const input = screen.getByPlaceholderText("Type here");

        await userEvent.type(input, "not-a-url");
        await userEvent.keyboard("{Enter}");

        await waitFor(() => {
            expect(
                screen.getByText("Please enter a valid URL")
            ).toBeInTheDocument();
        });
        expect(screen.queryByText("not-a-url")).not.toBeInTheDocument();
    });

    it("should accept a valid url when format is url", async () => {
        render(<FreeSoloWrapperComponent format="url" />);

        const input = screen.getByPlaceholderText("Type here");

        await userEvent.type(input, "https://example.com");
        await userEvent.keyboard("{Enter}");

        await waitFor(() => {
            expect(screen.getByText("https://example.com")).toBeInTheDocument();
        });
    });
});
