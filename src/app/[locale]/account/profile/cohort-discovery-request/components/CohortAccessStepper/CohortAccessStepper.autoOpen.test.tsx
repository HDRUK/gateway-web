import Cookies from "js-cookie";
import { PostLoginActions } from "@/consts/postLoginActions";
import { templateRepeatFields } from "@/interfaces/Cms";
import { render, waitFor } from "@/utils/testUtils";
import CohortAccessStepper from "./CohortAccessStepper";

jest.mock("js-cookie");

const mockUseAuth = jest.fn();
const mockUseCohortStatus = jest.fn();

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
    default: () => ({ showDialog: jest.fn() }),
}));

jest.mock("@/hooks/useModal", () => ({
    __esModule: true,
    default: () => ({ showModal: jest.fn() }),
}));

jest.mock("@/hooks/useLogout", () => ({
    __esModule: true,
    default: () => jest.fn(),
}));

jest.mock("@/providers/FeatureProvider", () => ({
    __esModule: true,
    useFeatures: () => ({
        isRQuestEnabled: false,
        isCohortDiscoveryServiceEnabled: true,
    }),
}));

const cmsContent: templateRepeatFields = {
    title: "T",
    subTitle: "S",
    description: "D",
    contents: [],
};

const cdsRedirectUrl = "https://cds.example.com";

const configureReadyApprovedStatus = () => {
    mockUseCohortStatus.mockImplementation(options => {
        if (options?.redirect && options?.useRQuest === false) {
            return {
                redirectUrl: cdsRedirectUrl,
                isLoading: false,
                hasFetched: true,
            };
        }

        if (options?.redirect) {
            return {
                redirectUrl: "https://rquest.example.com",
                isLoading: false,
                hasFetched: true,
            };
        }

        return {
            requestStatus: "APPROVED",
            requestExpiry: null,
            hasAccess: true,
            isLoading: false,
            hasFetched: true,
            refetch: jest.fn(),
        };
    });
};

describe("CohortAccessStepper - resuming Cohort Discovery after login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.open = jest.fn();
        configureReadyApprovedStatus();
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
    });

    it("opens Cohort Discovery Service in a new tab once the user returns from login with a pending action", async () => {
        (Cookies.get as jest.Mock).mockReturnValue(
            JSON.stringify({ action: PostLoginActions.OPEN_COHORT_DISCOVERY })
        );

        render(<CohortAccessStepper cmsContent={cmsContent} />);

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith(
                cdsRedirectUrl,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });

    it("does not open Cohort Discovery when there is no pending post-login action", () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        render(<CohortAccessStepper cmsContent={cmsContent} />);

        expect(window.open).not.toHaveBeenCalled();
    });

    it("does not open Cohort Discovery when a different post-login action is pending", () => {
        (Cookies.get as jest.Mock).mockReturnValue(
            JSON.stringify({ action: PostLoginActions.SAVE_SEARCH })
        );

        render(<CohortAccessStepper cmsContent={cmsContent} />);

        expect(window.open).not.toHaveBeenCalled();
    });
});
