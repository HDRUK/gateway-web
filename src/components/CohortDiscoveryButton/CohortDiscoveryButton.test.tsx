import Cookies from "js-cookie";
import userEvent from "@testing-library/user-event";
import config from "@/config/config";
import { PostLoginActions } from "@/consts/postLoginActions";
import { render, screen, waitFor } from "@/utils/testUtils";
import CohortDiscoveryButton from "./CohortDiscoveryButton";

jest.mock("js-cookie");

const mockUseAuth = jest.fn();
const mockUseCohortStatus = jest.fn();
const mockShowDialog = jest.fn();
const mockShowModal = jest.fn();
const mockUseFeatures = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => mockUseAuth(),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    __esModule: true,
    useCohortStatus: (
        _id: number | undefined,
        options?: { redirect?: boolean; useRQuest?: boolean }
    ) => mockUseCohortStatus(options),
}));

jest.mock("@/hooks/useDialog", () => ({
    __esModule: true,
    default: () => ({ showDialog: mockShowDialog }),
}));

jest.mock("@/hooks/useModal", () => ({
    __esModule: true,
    default: () => ({ showModal: mockShowModal }),
}));

jest.mock("@/hooks/useLogout", () => ({
    __esModule: true,
    default: () => jest.fn(),
}));

jest.mock("@/providers/FeatureProvider", () => ({
    __esModule: true,
    useFeatures: () => mockUseFeatures(),
}));

type CohortStatusConfig = {
    hasAccess?: boolean;
    requestStatus?: string | null;
    cdsRedirectUrl?: string;
    rQuestRedirectUrl?: string;
    loading?: boolean;
    hasFetched?: boolean;
    statusHasFetched?: boolean;
    rQuestHasFetched?: boolean;
    cdsHasFetched?: boolean;
};

const configureCohortStatus = ({
    hasAccess = true,
    requestStatus = "APPROVED",
    cdsRedirectUrl = "https://cds.example.com",
    rQuestRedirectUrl = "https://rquest.example.com",
    loading = false,
    hasFetched = true,
    statusHasFetched = hasFetched,
    rQuestHasFetched = hasFetched,
    cdsHasFetched = hasFetched,
}: CohortStatusConfig = {}) => {
    mockUseCohortStatus.mockImplementation(options => {
        if (options?.redirect && options?.useRQuest === false) {
            return {
                redirectUrl: cdsRedirectUrl,
                isLoading: loading,
                hasFetched: cdsHasFetched,
            };
        }

        if (options?.redirect) {
            return {
                redirectUrl: rQuestRedirectUrl,
                isLoading: loading,
                hasFetched: rQuestHasFetched,
            };
        }

        return {
            requestStatus,
            requestExpiry: null,
            hasAccess,
            isLoading: loading,
            hasFetched: statusHasFetched,
        };
    });
};

describe("CohortDiscoveryButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.open = jest.fn();
        mockUseFeatures.mockReturnValue({
            isRQuestEnabled: false,
            isCohortDiscoveryServiceEnabled: true,
        });
    });

    it("sets a post-login action cookie and opens the login modal when not logged in", async () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: false,
            user: undefined,
            claims: undefined,
            isLoading: false,
        });
        configureCohortStatus();

        render(<CohortDiscoveryButton />);

        await userEvent.click(
            screen.getByRole("button", { name: "Access Cohort Discovery" })
        );

        expect(mockShowDialog).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ isProvidersDialog: true })
        );

        await waitFor(() => {
            expect(Cookies.set).toHaveBeenCalledWith(
                config.POST_LOGIN_ACTION_COOKIE,
                JSON.stringify({
                    action: PostLoginActions.OPEN_COHORT_DISCOVERY,
                }),
                { path: "/" }
            );
        });
    });

    it("automatically opens Cohort Discovery once data is ready when autoTriggerAccess is set", async () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
        configureCohortStatus();

        render(<CohortDiscoveryButton autoTriggerAccess />);

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith(
                "https://cds.example.com",
                "_blank",
                "noopener,noreferrer"
            );
        });
    });

    it("does not auto-open while cohort status data is still loading", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
        configureCohortStatus({ loading: true, hasFetched: false });

        render(<CohortDiscoveryButton autoTriggerAccess />);

        expect(window.open).not.toHaveBeenCalled();
    });

    it("does not auto-open while only the CDS redirect URL is still being fetched", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
        configureCohortStatus({
            statusHasFetched: true,
            rQuestHasFetched: true,
            cdsHasFetched: false,
        });

        render(<CohortDiscoveryButton autoTriggerAccess />);

        expect(window.open).not.toHaveBeenCalled();
    });

    it("does not auto-open when autoTriggerAccess is not set, even once data is ready", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
        configureCohortStatus();

        render(<CohortDiscoveryButton />);

        expect(window.open).not.toHaveBeenCalled();
    });

    it("only auto-opens once even if the component re-renders", async () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
        configureCohortStatus();

        const { rerender } = render(<CohortDiscoveryButton autoTriggerAccess />);

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledTimes(1);
        });

        rerender(<CohortDiscoveryButton autoTriggerAccess label="Access" />);

        expect(window.open).toHaveBeenCalledTimes(1);
    });
});
