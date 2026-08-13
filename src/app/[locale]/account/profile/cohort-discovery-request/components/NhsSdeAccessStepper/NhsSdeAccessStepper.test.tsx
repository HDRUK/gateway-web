import userEvent from "@testing-library/user-event";
import NhsSdeAccessStepper from "./NhsSdeAccessStepper";
import { render, screen, waitFor } from "@/utils/testUtils";

const mockUseCohortStatus = jest.fn();
const mockUseFeatures = jest.fn();
const mockSubmitIndicate = jest.fn().mockResolvedValue(true);
const mockShowModal = jest.fn();

let lastModalProps: { onSuccess?: () => void | Promise<void> } | undefined;

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

jest.mock("@/hooks/usePost", () => ({
    __esModule: true,
    default: () => mockSubmitIndicate,
}));

jest.mock("@/hooks/useModal", () => ({
    __esModule: true,
    default: () => ({
        showModal: (props: { onSuccess?: () => void }) => {
            lastModalProps = props;
            mockShowModal(props);
        },
    }),
}));

jest.mock("@/utils/revalidateCache", () => ({
    __esModule: true,
    revalidateCache: jest.fn(),
}));

jest.mock("@/components/RequestNhseSdeAccessButton", () => ({
    __esModule: true,
    default: ({ label, action }: { label?: string; action?: () => void }) => (
        <button
            type="button"
            data-testid="request-nhse-sde-access-button"
            onClick={() => action && action()}>
            {label}
        </button>
    ),
}));

jest.mock("@/components/IndicateNhseSdeAccessButton", () => ({
    __esModule: true,
    default: ({ label, action }: { label?: string; action?: () => void }) => (
        <button
            type="button"
            data-testid="indicate-nhse-sde-access-button"
            onClick={() => action && action()}>
            {label}
        </button>
    ),
}));

const baseStatus = {
    requestStatus: null,
    nhseSdeRequestStatus: null,
    requestExpiry: null,
    isLoading: false,
    hasFetched: true,
    refetch: jest.fn(),
};

const baseFeatures = { isNhsSdeApplicationsEnabled: true };

const renderStepper = () => render(<NhsSdeAccessStepper />);

describe("NhsSdeAccessStepper", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        lastModalProps = undefined;
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

    it("shows an Awaiting Action badge and activates step 2 when the NHS request is IN PROCESS", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "IN PROCESS",
        });

        renderStepper();

        expect(screen.getByText("Awaiting Action")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Open NHS SDE Registration Form",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "I confirm I have completed the NHS Registration Form",
            })
        ).toBeInTheDocument();
    });

    it("advances to step 3 and fires the indicate POST via the confirm modal once the form is completed", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "IN PROCESS",
        });

        renderStepper();

        await userEvent.click(
            screen.getByRole("button", {
                name: "I confirm I have completed the NHS Registration Form",
            })
        );

        const indicateButton = screen.getByRole("button", {
            name: "I confirm I have been approved by the NHS Research SDE",
        });
        expect(indicateButton).toBeInTheDocument();

        await userEvent.click(indicateButton);
        expect(mockShowModal).toHaveBeenCalled();

        if (lastModalProps && lastModalProps.onSuccess) {
            await lastModalProps.onSuccess();
        }

        await waitFor(() =>
            expect(mockSubmitIndicate).toHaveBeenCalledWith({})
        );
    });

    it("shows a Pending badge when NHS approval has been requested", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "APPROVAL REQUESTED",
        });

        renderStepper();

        expect(screen.getByText("Pending")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", {
                name: "Open NHS SDE Registration Form",
            })
        ).not.toBeInTheDocument();
    });

    it("shows an Approved badge when NHS access has been granted", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "APPROVED",
        });

        renderStepper();

        expect(screen.getByText("Approved")).toBeInTheDocument();
    });

    it("hides all the steps once NHS access has been granted", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "APPROVED",
        });

        renderStepper();

        expect(
            screen.queryByText("Existing Cohort Discovery Access")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText("Complete NHS SDE Registration Form")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Access Decision")).not.toBeInTheDocument();
    });

    it.each(["REJECTED", "BANNED", "SUSPENDED"])(
        "shows a capitalised badge and hides the steps when the NHS request is %s",
        status => {
            mockUseCohortStatus.mockReturnValue({
                ...baseStatus,
                requestStatus: "APPROVED",
                nhseSdeRequestStatus: status,
            });

            renderStepper();

            expect(
                screen.getByText(
                    status.charAt(0) + status.slice(1).toLowerCase()
                )
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Existing Cohort Discovery Access")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Access Decision")
            ).not.toBeInTheDocument();
        }
    );

    it("lets an expired user restart the application from step 1", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: "EXPIRED",
        });

        renderStepper();

        expect(screen.getByText("Expired")).toBeInTheDocument();
        expect(
            screen.getByText("Existing Cohort Discovery Access")
        ).toBeInTheDocument();

        const applyButton = screen.getByRole("button", {
            name: "Apply for NHS Research SDE Cohort Data Access",
        });
        expect(applyButton).toBeInTheDocument();

        await userEvent.click(applyButton);

        expect(
            screen.getByRole("button", {
                name: "Open NHS SDE Registration Form",
            })
        ).toBeInTheDocument();
        expect(screen.getByText("Awaiting Action")).toBeInTheDocument();
        expect(screen.queryByText("Expired")).not.toBeInTheDocument();
    });

    it("reveals step 2 with the registration form once the user opts in from step 1", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
        });

        renderStepper();

        await userEvent.click(
            screen.getByRole("button", {
                name: "Apply for NHS Research SDE Cohort Data Access",
            })
        );

        expect(screen.getByText("Awaiting Action")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Open NHS SDE Registration Form",
            })
        ).toBeInTheDocument();
    });

    it("reveals the confirm button once the registration form has been opened, without waiting for the status to change", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
        });

        renderStepper();

        await userEvent.click(screen.getByTestId("nhs-sde-apply-button"));

        expect(
            screen.queryByTestId("nhs-sde-confirm-form-button")
        ).not.toBeInTheDocument();

        await userEvent.click(
            screen.getByTestId("request-nhse-sde-access-button")
        );

        await userEvent.click(
            screen.getByTestId("nhs-sde-confirm-form-button")
        );

        expect(
            screen.getByTestId("indicate-nhse-sde-access-button")
        ).toBeInTheDocument();
    });
});
