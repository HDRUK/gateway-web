import userEvent from "@testing-library/user-event";
import NhsSdeAccessStepper from "./NhsSdeAccessStepper";
import { render, screen } from "@/utils/testUtils";

const mockUseCohortStatus = jest.fn();
const mockUseFeatures = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ user: { id: 1 }, isLoading: false }),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    __esModule: true,
    useCohortStatus: () => mockUseCohortStatus(),
}));

jest.mock("@/providers/FeatureProvider", () => ({
    __esModule: true,
    useFeatures: () => mockUseFeatures(),
}));

const baseStatus = {
    requestStatus: null,
    nhseSdeRequestStatus: null,
    isLoading: false,
    hasFetched: true,
    refetch: jest.fn(),
};

const baseFeatures = { isNhsSdeApplicationsEnabled: true };

const renderStepper = () => render(<NhsSdeAccessStepper />);

describe("NhsSdeAccessStepper", () => {
    beforeEach(() => {
        mockUseCohortStatus.mockReturnValue(baseStatus);
        mockUseFeatures.mockReturnValue(baseFeatures);
    });

    it("locks step 1 when Cohort Discovery access has not been approved", () => {
        renderStepper();

        expect(
            screen.getByText("Existing Cohort Discovery Access")
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", {
                name: "Apply for NHS Research SDE Cohort Data Access",
            })
        ).not.toBeInTheDocument();
    });

    it("shows step 1 as complete with an apply button when Cohort Discovery is approved", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
        });

        renderStepper();

        const applyButton = screen.getByRole("button", {
            name: "Apply for NHS Research SDE Cohort Data Access",
        });
        expect(applyButton).toBeInTheDocument();

        await userEvent.click(applyButton);

        expect(
            screen.queryByRole("button", {
                name: "Apply for NHS Research SDE Cohort Data Access",
            })
        ).not.toBeInTheDocument();
    });

    it("shows the pilot text and hides the steps when the feature flag is off", () => {
        mockUseFeatures.mockReturnValue({ isNhsSdeApplicationsEnabled: false });

        renderStepper();

        expect(
            screen.getByText(/currently in its pilot phase/i)
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Existing Cohort Discovery Access")
        ).not.toBeInTheDocument();
    });
});
