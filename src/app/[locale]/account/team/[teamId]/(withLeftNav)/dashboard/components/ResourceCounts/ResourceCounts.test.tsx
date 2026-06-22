import useGet from "@/hooks/useGet";
import { fireEvent, render, screen, within } from "@/utils/testUtils";
import ResourceCounts from "./ResourceCounts";

jest.mock("@/hooks/useGet");

const defaultProps = {
    teamId: "42",
    startDate: "2025-06-12",
    endDate: "2026-06-12",
    initialCounts: {},
};

beforeEach(() => {
    (useGet as jest.Mock).mockImplementation((url: string | null) => ({
        data: url ? { total: 235, total_by_interval: 5 } : undefined,
        isLoading: false,
        mutate: jest.fn(),
    }));
});

describe("ResourceCounts", () => {
    it("renders the default resource cards with counts and period chip", () => {
        render(<ResourceCounts {...defaultProps} />);

        const datasetsCard = screen.getByTestId("resource-card-datasets");
        expect(within(datasetsCard).getByText("235")).toBeInTheDocument();
        expect(
            within(datasetsCard).getByText("5 added this period")
        ).toBeInTheDocument();
    });

    it("omits the chip when nothing was added in the period", () => {
        (useGet as jest.Mock).mockReturnValue({
            data: { total: 10, total_by_interval: 0 },
            isLoading: false,
            mutate: jest.fn(),
        });

        render(<ResourceCounts {...defaultProps} />);

        expect(
            screen.queryByText(/added this period/)
        ).not.toBeInTheDocument();
    });

    it("requests counts for the selected period", () => {
        render(<ResourceCounts {...defaultProps} />);

        expect(useGet).toHaveBeenCalledWith(
            expect.stringContaining(
                "/teams/42/dashboard/datasets/count?startDate=2025-06-12&endDate=2026-06-12"
            ),
            expect.any(Object)
        );
    });

    it("adds a card when an extra resource is selected", () => {
        render(<ResourceCounts {...defaultProps} />);

        expect(
            screen.queryByTestId("resource-card-general-enquires")
        ).not.toBeInTheDocument();

        fireEvent.mouseDown(
            screen.getByRole("combobox", { name: "Choose resources" })
        );
        fireEvent.click(
            screen.getByRole("option", { name: /General Enquiries/ })
        );

        const card = screen.getByTestId("resource-card-general-enquires");
        expect(within(card).getByText("235")).toBeInTheDocument();
    });

    it("removes a card when its resource is deselected", () => {
        render(<ResourceCounts {...defaultProps} />);

        fireEvent.mouseDown(
            screen.getByRole("combobox", { name: "Choose resources" })
        );
        fireEvent.click(screen.getByRole("option", { name: /Collections/ }));

        expect(
            screen.queryByTestId("resource-card-collections")
        ).not.toBeInTheDocument();
    });
});
