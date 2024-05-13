import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import FormBanner from "./FormBanner";

const tabsList = [
    { label: "Online Form", value: "FORM" },
    { label: "Upload File", value: "UPLOAD" },
].map(tabItem => ({
    label: `${tabItem.label} `,
    value: tabItem.value,
    content: null,
}));

describe("FormBanner", () => {
    const downloadFn = jest.fn();
    const makeActiveFn = jest.fn();
    const saveDraftFn = jest.fn();

    it("should render all data", async () => {
        render(
            <FormBanner
                tabItems={tabsList}
                downloadAction={downloadFn}
                makeActiveAction={makeActiveFn}
                saveAsDraftAction={saveDraftFn}
                completionPercentage={20}
                optionalPercentage={0}
            />
        );
        expect(screen.getByText("Online Form")).toBeInTheDocument();
        expect(screen.getByText("20% (required fields)")).toBeInTheDocument();
    });

    it("should fire all functions", async () => {
        render(
            <FormBanner
                tabItems={tabsList}
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
