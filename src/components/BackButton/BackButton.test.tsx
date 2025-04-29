import BackButton from "@/components/BackButton";
import { getPreviousPage } from "@/hooks/useTrackPreviousPage";
import { fireEvent, render, screen } from "@/utils/testUtils";

jest.mock("@/hooks/useTrackPreviousPage", () => ({
    getPreviousPage: jest.fn(),
}));

describe("BackButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render a back button when previousPage exists", () => {
        (getPreviousPage as jest.Mock).mockReturnValue("/previous-page");

        render(<BackButton label="Back Button" />);

        const button = screen.getByRole("button", { name: /back button/i });
        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked and no previousPage", () => {
        (getPreviousPage as jest.Mock).mockReturnValue(null);

        const mockOnClick = jest.fn();
        render(<BackButton label="Back" onClick={mockOnClick} />);

        fireEvent.click(screen.getByRole("button", { name: /back/i }));

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not render if no previousPage and no onClick", () => {
        (getPreviousPage as jest.Mock).mockReturnValue(null);

        render(<BackButton label="No Show" />);

        expect(screen.queryByText("No Show")).not.toBeInTheDocument();
    });
});
