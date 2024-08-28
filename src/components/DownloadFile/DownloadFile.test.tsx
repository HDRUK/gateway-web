import mockRouter from "next-router-mock";
import apiService from "@/services/api";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { datasetV1 } from "@/mocks/data/dataset";
import DownloadFile from "./DownloadFile";

jest.mock("@/services/api");
global.URL.createObjectURL = jest.fn();

const mockDownloadExternalFile = jest.fn();
jest.mock("@/utils/download", () => ({
    ...jest.requireActual("@/utils/download"),
    downloadExternalFile: (response: Response, filename: string) =>
        mockDownloadExternalFile(response, filename),
}));

mockRouter.query = { teamId: `${datasetV1.id}` };

const buttonText = "Click here";
const apiPath = "api/path";
const externalFileName = "externalFile.csv";

describe("DownloadFile", () => {
    it("should call export api with team id", async () => {
        render(<DownloadFile buttonText={buttonText} apiPath={apiPath} />);

        (apiService.getRequest as jest.Mock).mockResolvedValue({
            content: "",
            type: "text/csv",
            filename: "download.csv",
        });

        fireEvent.click(screen.getByText(buttonText));

        await waitFor(() => {
            expect(apiService.getRequest).toHaveBeenCalledWith(apiPath, {
                notificationOptions: {
                    action: undefined,
                    errorNotificationsOn: undefined,
                    itemName: undefined,
                    localeKey: undefined,
                    t: expect.any(Function),
                },
                withPagination: false,
            });
        });
    });
    it("should apply buttonSx styles", async () => {
        const customSx = { color: "red", marginBottom: "4px" };

        render(
            <DownloadFile
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
            <DownloadFile
                buttonText={buttonText}
                apiPath={apiPath}
                isExternalFile
                externalFileName={externalFileName}
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
                externalFileName
            );
        });

        fetchMock.mockRestore();
    });
});
