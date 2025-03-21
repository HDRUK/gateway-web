import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import Upload from "@/components/Upload";
import { render, screen } from "@/utils/testUtils";

describe("Upload", () => {
    // As we are passing the props as any type, added eslint disable line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const label = "Upload File";
        const { control } = useForm();
        return (
            <Upload
                label={label}
                name="uploadFile"
                control={control}
                helperText="Max file size: 5MB"
                {...props}
            />
        );
    };
    it("renders the component with the correct label", () => {
        render(<Component />);
        expect(screen.getByText("Upload File")).toBeInTheDocument();
    });

    it("displays the helper text", () => {
        render(<Component />);
        expect(screen.getByText("Max file size: 5MB")).toBeInTheDocument();
    });

    it("calls `onFileChange` when a file is uploaded", async () => {
        const onFileChangeMock = jest.fn();
        render(<Component onFileChange={onFileChangeMock} />);

        const file = new File(["dummy content"], "testFile.txt", {
            type: "text/plain",
        });

        const fileInput = screen
            .getByLabelText("Upload File")
            .querySelector("input") as HTMLInputElement;

        await userEvent.upload(fileInput, file);

        expect(onFileChangeMock).toHaveBeenCalledTimes(1);
        expect(onFileChangeMock).toHaveBeenCalledWith(file);
    });
});
