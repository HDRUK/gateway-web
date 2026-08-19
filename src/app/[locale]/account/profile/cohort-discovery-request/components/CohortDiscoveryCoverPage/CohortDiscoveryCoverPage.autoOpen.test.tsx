import Cookies from "js-cookie";
import { PostLoginActions } from "@/consts/postLoginActions";
import { templateRepeatFields } from "@/interfaces/Cms";
import { render, waitFor } from "@/utils/testUtils";
import CohortDiscoveryCoverPage from "./CohortDiscoveryCoverPage";

/**
 * CohortDiscoveryCoverPage decides which of two different
 * CohortDiscoveryButton instances is actually on screen - the one inside
 * CohortAccessStepper normally, or the one inside CohortAccessPanel when
 * both Cohort Discovery and NHS SDE access are approved. Both real
 * components (and the real CohortDiscoveryButton) are used here so this
 * proves the resume-after-login outcome for both branches, rather than
 * assuming wiring into one branch also covers the other.
 */

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

jest.mock("../NhsSdeAccessStepper", () => ({
    __esModule: true,
    default: () => <div data-testid="nhs-sde-access-stepper" />,
}));

const cmsContent: templateRepeatFields = {
    title: "T",
    subTitle: "S",
    description: "D",
    contents: [],
};

const cdsRedirectUrl = "https://cds.example.com";

const configureCohortStatus = ({
    nhseSdeRequestStatus,
}: {
    nhseSdeRequestStatus: string | null;
}) => {
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
            nhseSdeRequestStatus,
            isLoading: false,
            hasFetched: true,
            refetch: jest.fn(),
        };
    });
};

const renderPage = () =>
    render(<CohortDiscoveryCoverPage cmsContent={cmsContent} />);

describe("CohortDiscoveryCoverPage - resuming Cohort Discovery after login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.open = jest.fn();
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: 1 },
            claims: { cohort_discovery_roles: ["GENERAL_ACCESS"] },
            isLoading: false,
        });
    });

    it("opens Cohort Discovery from the stepper's access button when only cohort access is approved", async () => {
        configureCohortStatus({ nhseSdeRequestStatus: "IN PROCESS" });
        (Cookies.get as jest.Mock).mockReturnValue(
            JSON.stringify({ action: PostLoginActions.OPEN_COHORT_DISCOVERY })
        );

        renderPage();

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith(
                cdsRedirectUrl,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });

    it("opens Cohort Discovery from the shared access panel when both cohort and NHS SDE access are approved", async () => {
        configureCohortStatus({ nhseSdeRequestStatus: "APPROVED" });
        (Cookies.get as jest.Mock).mockReturnValue(
            JSON.stringify({ action: PostLoginActions.OPEN_COHORT_DISCOVERY })
        );

        renderPage();

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith(
                cdsRedirectUrl,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });

    it("does not open Cohort Discovery when there is no pending post-login action, even with both accesses approved", () => {
        configureCohortStatus({ nhseSdeRequestStatus: "APPROVED" });
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        renderPage();

        expect(window.open).not.toHaveBeenCalled();
    });
});
