import { render, screen, waitFor, fireEvent } from "@/utils/testUtils";
import Dashboard from "./dashboard";

jest.useFakeTimers().setSystemTime(new Date("2025-06-12"));

jest.mock("@/components/DownloadFile", () => ({
    __esModule: true,
    default: ({ apiPath }: { apiPath: string }) => (
        <a href={apiPath} data-testid="download-link">
            Download
        </a>
    ),
}));

const defaultCounts = {
    datasets: { total: 0, total_by_interval: 0 },
    datauses: { total: 0, total_by_interval: 0 },
    tools: { total: 0, total_by_interval: 0 },
    collections: { total: 0, total_by_interval: 0 },
    publications: { total: 0, total_by_interval: 0 },
};

describe("Dashboard", () => {
    it("updates download URL when period is changed", async () => {
        render(<Dashboard teamId="42" initialCounts={defaultCounts} />);

        fireEvent.mouseDown(screen.getByRole("combobox"));
        fireEvent.click(screen.getByRole("option", { name: "Last 3 months" }));

        await waitFor(() => {
            const link = screen.getByTestId("download-link");
            expect(link).toHaveAttribute(
                "href",
                expect.stringContaining("startDate=2025-03-12")
            );
            expect(link).toHaveAttribute(
                "href",
                expect.stringContaining("endDate=2025-06-12")
            );
        });
    });
});
