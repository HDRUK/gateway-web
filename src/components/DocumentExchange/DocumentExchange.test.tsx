import { useForm, FormProvider } from "react-hook-form";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "@/utils/testUtils";
import { UploadFileProps, UploadFormData } from "./DocumentExchange";
import DocumentExchange from "./DocumentExchange";

const MockDocumentExchange = (props: Partial<UploadFileProps>) => {
    const methods = useForm<UploadFormData>({
        defaultValues: {
            upload: {
                value: { id: 1, filename: "test-file-1.png" },
            },
        },
    });

    return (
        <FormProvider {...methods}>
            <DocumentExchange {...props} control={methods.control} />
        </FormProvider>
    );
};

describe("DocumentExchange Component", () => {
    it("renders the DocumentExchange component and file select button", () => {
        render(<MockDocumentExchange label="Upload Your File" />);

        expect(screen.getByText("Upload Your File")).toBeInTheDocument();
    });

    it("handles file removal", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockDocumentExchange
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        expect(screen.getByText("test-file-1.png")).toBeInTheDocument();

        const removeButton = screen.getByLabelText(
            "Remove file test-file-1.png"
        );
        fireEvent.click(removeButton);

        await waitFor(() => expect(onFileRemove).toHaveBeenCalled());
    });

    it("does not allow file upload if no file is selected", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockDocumentExchange
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
                fileSelectButtonText="Select file"
            />
        );

        const reuploadButton = screen.getAllByText("Re-upload")[1];
        fireEvent.click(reuploadButton);

        const uploadButton = screen.getByText("Upload");
        expect(uploadButton).toBeDisabled();
    });

    it("handles file upload button state correctly", async () => {
        const onFileRemove = jest.fn();
        render(
            <MockDocumentExchange
                onFileRemove={onFileRemove}
                fileDownloadApiPath="/file/download"
                label="Uploaded File"
                allowMultipleFiles
            />
        );

        const reuploadButton = screen.getAllByText("Re-upload")[1];
        fireEvent.click(reuploadButton);

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
