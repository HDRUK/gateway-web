import { templateRepeatFields } from "@/interfaces/Cms";
import CohortDiscoveryCoverPage from "./CohortDiscoveryCoverPage";
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

jest.mock("../CohortAccessStepper", () => ({
    __esModule: true,
    default: ({ hideAccessButton }: { hideAccessButton?: boolean }) => (
        <div data-testid="cohort-access-stepper">
            {hideAccessButton ? "button-hidden" : "button-shown"}
        </div>
    ),
}));

jest.mock("../NhsSdeAccessStepper", () => ({
    __esModule: true,
    default: () => <div data-testid="nhs-sde-access-stepper" />,
}));

jest.mock("@/components/CohortDiscoveryButton", () => ({
    __esModule: true,
    default: ({ label }: { label?: string }) => (
        <button type="button">{label ?? "Access"}</button>
    ),
}));

const baseStatus = {
    requestStatus: null,
    hasAccess: false,
    requestExpiry: null,
    nhseSdeRequestStatus: null,
    isLoading: false,
    hasFetched: true,
    refetch: jest.fn(),
};

const cmsContent: templateRepeatFields = {
    title: "T",
    subTitle: "S",
    description: "D",
    contents: [],
};

const renderPage = () =>
    render(<CohortDiscoveryCoverPage cmsContent={cmsContent} />);

describe("CohortDiscoveryCoverPage", () => {
    it("does not render a shared access panel when only one access is approved", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            hasAccess: true,
            nhseSdeRequestStatus: "IN PROCESS",
        });

        renderPage();

        expect(screen.getByText("button-shown")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", {
                name: "Access Cohort Discovery tool",
            })
        ).not.toBeInTheDocument();
    });

    it("combines into a single shared access panel when both accesses are approved", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            hasAccess: true,
            nhseSdeRequestStatus: "APPROVED",
        });

        renderPage();

        expect(screen.getByText("button-hidden")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Access Cohort Discovery tool",
            })
        ).toBeInTheDocument();
    });
});
