import userEvent from "@testing-library/user-event";
import { templateRepeatFields } from "@/interfaces/Cms";
import { render, screen } from "@/utils/testUtils";
import CohortAccessStepper from "./CohortAccessStepper";

const mockUseCohortStatus = jest.fn();
const mockShowDialog = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ user: { id: 1 }, isLoading: false }),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    __esModule: true,
    useCohortStatus: () => mockUseCohortStatus(),
}));

jest.mock("@/hooks/useDialog", () => ({
    __esModule: true,
    default: () => ({ showDialog: mockShowDialog }),
}));

jest.mock("@/components/CohortDiscoveryButton", () => ({
    __esModule: true,
    default: ({ label }: { label?: string }) => (
        <button type="button">{label ?? "Access"}</button>
    ),
}));

jest.mock("../../../components/ProfileForm", () => ({
    __esModule: true,
    default: ({
        submitLabel,
        onSaved,
    }: {
        submitLabel?: string;
        onSaved?: () => void;
    }) => (
        <button type="button" onClick={onSaved}>
            {submitLabel ?? "Save"}
        </button>
    ),
}));

jest.mock("../CohortUserDeclaration", () => ({
    __esModule: true,
    default: ({ onSubmit }: { onSubmit: () => void }) => (
        <button type="button" onClick={onSubmit}>
            submit-declaration
        </button>
    ),
}));

jest.mock("../CohortRequestTermsDialog", () => ({
    __esModule: true,
    default: () => null,
}));

const cmsContent: templateRepeatFields = {
    title: "T",
    subTitle: "S",
    description: "D",
    contents: [],
};

const baseStatus = {
    requestStatus: null,
    requestExpiry: null,
    nhseSdeRequestStatus: null,
    isLoading: false,
    hasFetched: true,
    refetch: jest.fn(),
};

const renderStepper = () =>
    render(<CohortAccessStepper cmsContent={cmsContent} />);

describe("CohortAccessStepper", () => {
    beforeEach(() => {
        mockUseCohortStatus.mockReturnValue(baseStatus);
        mockShowDialog.mockClear();
    });

    it("shows the Apply button and the outer steps when there is no request", () => {
        renderStepper();

        expect(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        ).toBeInTheDocument();
        expect(screen.getByText("Application Review")).toBeInTheDocument();
        expect(screen.getByText("Access Decision")).toBeInTheDocument();
    });

    it("reveals the profile and terms sub-steps once Apply is clicked", async () => {
        renderStepper();

        await userEvent.click(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        );

        expect(screen.getByText("Review Your Profile")).toBeInTheDocument();
        expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    });

    it("advances past the profile step to terms when the profile is saved", async () => {
        renderStepper();

        await userEvent.click(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Save & continue" })
        );

        expect(
            screen.queryByRole("button", { name: "Save & continue" })
        ).not.toBeInTheDocument();
        expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    });

    it("opens the terms dialog when the declaration is submitted", async () => {
        renderStepper();

        await userEvent.click(
            screen.getByRole("button", { name: "Apply for Cohort Discovery" })
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Save & continue" })
        );
        await userEvent.click(
            screen.getByRole("button", { name: "submit-declaration" })
        );

        expect(mockShowDialog).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                cmsContent,
                onSubmitted: expect.any(Function),
            })
        );
    });

    it("shows a Pending chip and the review step once a request exists", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "PENDING",
        });

        renderStepper();

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

        renderStepper();

        expect(screen.getByText("Approved")).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Access Cohort Discovery tool",
            })
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Application Review")
        ).not.toBeInTheDocument();
    });

    it("hides the access button when hideAccessButton is set", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "APPROVED",
        });

        render(
            <CohortAccessStepper cmsContent={cmsContent} hideAccessButton />
        );

        expect(screen.getByText("Approved")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", {
                name: "Access Cohort Discovery tool",
            })
        ).not.toBeInTheDocument();
    });

    it("offers the re-apply button to an expired user", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "EXPIRED",
        });

        renderStepper();

        expect(screen.getByText("Expired")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Re-apply for access" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Apply for Cohort Discovery" })
        ).not.toBeInTheDocument();
    });

    it("restarts a rejected user from the profile step through to the terms dialog", async () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "REJECTED",
        });

        renderStepper();

        expect(screen.getByText("Rejected")).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: "Re-apply for access" })
        );

        expect(screen.getByText("Review Your Profile")).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: "Save & continue" })
        );
        await userEvent.click(
            screen.getByRole("button", { name: "submit-declaration" })
        );

        expect(mockShowDialog).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                cmsContent,
                onSubmitted: expect.any(Function),
            })
        );
    });

    it("does not offer re-apply to a banned user", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            requestStatus: "BANNED",
        });

        renderStepper();

        expect(screen.getByText("Banned")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Re-apply for access" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Apply for Cohort Discovery" })
        ).not.toBeInTheDocument();
    });

    it("hides the steps while the status is still loading", () => {
        mockUseCohortStatus.mockReturnValue({
            ...baseStatus,
            isLoading: true,
            hasFetched: false,
        });

        renderStepper();

        expect(
            screen.queryByText("Application Review")
        ).not.toBeInTheDocument();
    });
});
