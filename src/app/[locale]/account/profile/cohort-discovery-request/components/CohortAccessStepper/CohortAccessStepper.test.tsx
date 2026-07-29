import userEvent from "@testing-library/user-event";
import CohortAccessStepper from "./CohortAccessStepper";
import { render, screen } from "@/utils/testUtils";

const mockUseCohortStatus = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ user: { id: 1 }, isLoading: false }),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    __esModule: true,
    useCohortStatus: () => mockUseCohortStatus(),
}));

jest.mock("@/components/CohortDiscoveryButton", () => ({
    __esModule: true,
    default: ({ label }: { label?: string }) => (
        <button type="button">{label ?? "Access"}</button>
    ),
}));

const baseStatus = {
    requestStatus: null,
    requestExpiry: null,
    nhseSdeRequestStatus: null,
    isLoading: false,
    hasFetched: true,
    refetch: jest.fn(),
};

describe("CohortAccessStepper", () => {
    beforeEach(() => {
        mockUseCohortStatus.mockReturnValue(baseStatus);
    });

    it("shows the Apply button and the outer steps when there is no request", () => {
        render(<CohortAccessStepper />);

        expect(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        ).toBeInTheDocument();
        expect(screen.getByText("Application Review")).toBeInTheDocument();
        expect(screen.getByText("Access Decision")).toBeInTheDocument();
    });

    it("reveals the profile and terms sub-steps once Apply is clicked", async () => {
        render(<CohortAccessStepper />);

        await userEvent.click(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        );

        expect(screen.getByText("Review Your Profile")).toBeInTheDocument();
        expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    });

    it("shows a Pending chip and the review step once a request exists", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "PENDING",
        });

        render(<CohortAccessStepper />);

        expect(screen.getByText("Pending")).toBeInTheDocument();
        expect(screen.getByText("Application Review")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Apply for Cohort Discovery" })
        ).not.toBeInTheDocument();
    });

    it("shows the compact approved bar with the access button and hides the steps", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
        });

        render(<CohortAccessStepper />);

        expect(screen.getByText("Approved")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Access Cohort Discovery tool",
            })
        ).toBeInTheDocument();
        expect(screen.queryByText("Application Review")).not.toBeInTheDocument();
    });

    it("hides the steps while the status is still loading", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            isLoading: true,
            hasFetched: false,
        });

        render(<CohortAccessStepper />);

        expect(screen.queryByText("Application Review")).not.toBeInTheDocument();
    });
});
