import apiService from "@/services/api";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import DownloadFile from "./DownloadFile";

global.URL.createObjectURL = jest.fn();

const buttonText = "Click here";
const apiPath = "api/path";

const getSpy = jest.spyOn(apiService, "getRequest");

describe("DownloadFile", () => {
    it("should call export api", async () => {
        render(<DownloadFile buttonText={buttonText} apiPath={apiPath} />);

        getSpy.mockResolvedValue({
            content: "",
            type: "text/csv",
            filename: "download.csv",
        });

        fireEvent.click(screen.getByText(buttonText));

        await waitFor(() => {
            expect(getSpy).toHaveBeenCalledWith(apiPath, {
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
        const customSx = { color: "red", mb: "4px" };

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
});
