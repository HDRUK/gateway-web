import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import mockRouter from "next-router-mock";
import apiService from "@/services/api";
import { datasetV1 } from "@/mocks/data/dataset";
import DownloadCSV from "./DownloadCSV";

jest.mock("@/services/api");
global.URL.createObjectURL = jest.fn();

mockRouter.query = { teamId: `${datasetV1.id}` };

describe("DownloadCSV", () => {
    it("should call export api with team id", async () => {
        const buttonText = "Click here";
        const apiPath = "api/path";
        render(<DownloadCSV buttonText={buttonText} apiPath={apiPath} />);

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
});
