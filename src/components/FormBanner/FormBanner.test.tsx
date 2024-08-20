import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import FormBanner from "./FormBanner";

describe("FormBanner", () => {
    const downloadFn = jest.fn();
    const makeActiveFn = jest.fn();
    const saveDraftFn = jest.fn();

    it("should render all data", async () => {
        render(
            <FormBanner
                downloadAction={downloadFn}
                makeActiveAction={makeActiveFn}
                saveAsDraftAction={saveDraftFn}
                completionPercentage={20}
                optionalPercentage={0}
            />
        );
        expect(screen.getByText("20% (required fields)")).toBeInTheDocument();
    });

    it("should fire all functions", async () => {
        render(
            <FormBanner
                downloadAction={downloadFn}
                makeActiveAction={makeActiveFn}
                saveAsDraftAction={saveDraftFn}
            />
        );
        fireEvent.click(screen.getByTestId("btn-download"));
        fireEvent.click(screen.getByTestId("btn-make-active"));
        fireEvent.click(screen.getByTestId("btn-save-draft"));

        await waitFor(() => {
            expect(downloadFn).toHaveBeenCalled();
            expect(makeActiveFn).toHaveBeenCalled();
            expect(saveDraftFn).toHaveBeenCalled();
        });
    });
});
