import { isValidElement, ReactElement, ReactNode } from "react";
import { RouteName } from "@/consts/routeName";
import { render, screen } from "@/utils/testUtils";
import DashboardPage from "./page";

const mockIsCustodianDashboardEnabled = jest.fn();
jest.mock("@/flags", () => ({
    isCustodianDashboardEnabled: () => mockIsCustodianDashboardEnabled(),
}));

jest.mock("next/navigation", () => ({
    notFound: () => {
        throw new Error("NEXT_NOT_FOUND");
    },
    redirect: (url: string) => {
        throw new Error(`NEXT_REDIRECT ${url}`);
    },
}));

const mockGetUser = jest.fn();
const mockGetTeam = jest.fn();
const mockGetDashboardEntityCount = jest.fn();
jest.mock("@/utils/api", () => ({
    getUser: () => mockGetUser(),
    getTeam: (teamId: string) => mockGetTeam(teamId),
    getDashboardEntityCount: (teamId: string, entity: string) =>
        mockGetDashboardEntityCount(teamId, entity),
}));

jest.mock("./dashboard", () => ({
    __esModule: true,
    default: ({
        teamName,
        initialCounts,
    }: {
        teamName: string;
        initialCounts: { datasets: { total: number } };
    }) => (
        <div>
            {teamName} dashboard with {initialCounts.datasets.total} datasets
        </div>
    ),
}));

const teamId = "19";
const userId = 7;

const roleWithPermissions = (permissionNames: string[]) => ({
    name: "custodian.team.role",
    enabled: true,
    permissions: permissionNames.map(name => ({ name })),
});

const givenTeamMemberWithPermissions = (permissionNames: string[]) => {
    mockGetUser.mockResolvedValue({ id: userId, roles: [] });
    mockGetTeam.mockResolvedValue({
        name: "Example Team",
        is_question_bank: false,
        users: [{ id: userId, roles: [roleWithPermissions(permissionNames)] }],
    });
};

const resolveServerTree = async (node: ReactNode): Promise<ReactNode> => {
    let current = node;

    while (
        isValidElement(current) &&
        typeof current.type === "function" &&
        current.type.constructor.name === "AsyncFunction"
    ) {
        const element = current as ReactElement;
        current = await (
            element.type as (props: unknown) => Promise<ReactNode>
        )(element.props);
    }

    return current;
};

const renderPage = async () =>
    resolveServerTree(
        await DashboardPage({ params: Promise.resolve({ teamId }) })
    );

describe("DashboardPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockIsCustodianDashboardEnabled.mockResolvedValue(true);
        mockGetDashboardEntityCount.mockResolvedValue({
            total: 12,
            total_by_interval: 3,
        });
    });

    it("is not found when the custodian dashboard is disabled", async () => {
        mockIsCustodianDashboardEnabled.mockResolvedValue(false);
        givenTeamMemberWithPermissions(["dashboard.read"]);

        await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
        expect(mockGetDashboardEntityCount).not.toHaveBeenCalled();
    });

    it("redirects to 403 without fetching counts when the user lacks dashboard.read", async () => {
        givenTeamMemberWithPermissions(["datasets.read"]);

        await expect(renderPage()).rejects.toThrow(
            `NEXT_REDIRECT ${RouteName.ERROR_403}`
        );
        expect(mockGetDashboardEntityCount).not.toHaveBeenCalled();
    });

    it("shows the team dashboard with counts when the user has dashboard.read", async () => {
        givenTeamMemberWithPermissions(["dashboard.read"]);

        render(<>{await renderPage()}</>);

        expect(
            screen.getByText("Example Team dashboard with 12 datasets")
        ).toBeInTheDocument();
    });
});
