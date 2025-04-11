import { useForm, FormProvider } from "react-hook-form";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "@/utils/testUtils";
import UploadFile, { UploadFileProps, UploadFormData } from "./UploadFile";

const MockUploadFile = (props: Partial<UploadFileProps>) => {
    const methods = useForm<UploadFormData>({
        defaultValues: {
            upload: {
                value: [
                    { id: 1, filename: "test-file-1.png" },
                    { id: 2, filename: "test-file-2.png" },
                ],
            },
        },
    });

    return (
        <FormProvider {...methods}>
            <UploadFile {...props} control={methods.control} />
        </FormProvider>
    );
};

describe("UploadFile Component", () => {
    it("renders the UploadFile component and file select button", () => {
        render(<MockUploadFile label="Upload Your File" />);

        expect(screen.getByText("Upload Your File")).toBeInTheDocument();
        expect(screen.getByText("Upload")).toBeInTheDocument();
    });

    it("handles file removal", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockUploadFile
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        expect(screen.getByText("test-file-1.png")).toBeInTheDocument();
        expect(screen.getByText("test-file-2.png")).toBeInTheDocument();

        const removeButton = screen.getByLabelText(
            "Remove file test-file-1.png"
        );
        fireEvent.click(removeButton);

        await waitFor(() => expect(onFileRemove).toHaveBeenCalledWith(1));
    });

    it("handles multiple file uploads", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockUploadFile
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        expect(screen.getByText("test-file-1.png")).toBeInTheDocument();
        expect(screen.getByText("test-file-2.png")).toBeInTheDocument();

        const removeButton = screen.getByLabelText(
            "Remove file test-file-2.png"
        );
        fireEvent.click(removeButton);

        await waitFor(() => expect(onFileRemove).toHaveBeenCalledWith(2));
    });

    it("does not allow file upload if no file is selected", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockUploadFile
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        const uploadButton = screen.getByText("Upload");
        expect(uploadButton).toBeDisabled();
    });

    it("handles file upload button state correctly", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockUploadFile
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        const uploadButton = screen.getByText("Upload");
        expect(uploadButton).toBeDisabled();

        const fileInput = screen
            .getByLabelText("Select file")
            .querySelector("input") as HTMLInputElement;

        fireEvent.change(fileInput, {
            target: { files: [new File(["test"], "test-file.png")] },
        });

        expect(uploadButton).not.toBeDisabled();
    });
});
