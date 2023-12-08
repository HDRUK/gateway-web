import { render, screen, waitFor, within, fireEvent } from "@/utils/testUtils";
import CohortTableDownload from "./CohortTableDownload";

describe("Cohort Table Download", () => {
    it("should render row headers", async () => {
        // Mock the createObjectURL function that is called when downloading the csv
        window.URL.createObjectURL = jest.fn();

        render(<CohortTableDownload />);
        expect(
            screen.getByText("Download dashboard report")
        ).toBeInTheDocument();

        expect(screen.queryByText("Date range:")).not.toBeInTheDocument();

        const button = screen.getByLabelText("download-cohort-table");
        fireEvent.click(button);

        expect(screen.getByText("Export Filters")).toBeInTheDocument();
        expect(screen.getByText("Date range:")).toBeInTheDocument();

        const exportButton = screen.getByText("Export xs file");
        fireEvent.click(exportButton);

        expect(screen.queryByText("Date range:")).not.toBeInTheDocument();

        //expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
});
