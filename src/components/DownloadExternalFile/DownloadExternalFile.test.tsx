import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import DownloadExternalFile from "./DownloadExternalFile";

jest.mock("@/services/api");
global.URL.createObjectURL = jest.fn();

const mockDownloadExternalFile = jest.fn();
jest.mock("@/utils/download", () => ({
    ...jest.requireActual("@/utils/download"),
    downloadExternalFile: (response: Response, filename: string) =>
        mockDownloadExternalFile(response, filename),
}));

const buttonText = "Click here";
const apiPath = "api/path";
const fileName = "externalFile.csv";

describe("DownloadExternalFile", () => {
    it("should apply buttonSx styles", async () => {
        const customSx = { color: "red", mb: "4px" };

        render(
            <DownloadExternalFile
                buttonText={buttonText}
                apiPath={apiPath}
                buttonSx={customSx}
            />
        );

        const button = screen.getByRole("button");
        expect(button).toHaveStyle("color: red");
        expect(button).toHaveStyle("margin-bottom: 4px");
    });

    it("should download external file with correct filename", async () => {
        const fetchMock = jest.spyOn(window, "fetch").mockResolvedValue({
            ok: true,
            blob: () =>
                Promise.resolve(
                    new Blob(["file content"], { type: "text/csv" })
                ),
        } as Response);

        render(
            <DownloadExternalFile
                buttonText={buttonText}
                apiPath={apiPath}
                fileName={fileName}
            />
        );

        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(apiPath);

            expect(mockDownloadExternalFile).toHaveBeenCalledWith(
                expect.objectContaining({
                    ok: true,
                    blob: expect.any(Function),
                }),
                fileName
            );
        });

        fetchMock.mockRestore();
    });
});
