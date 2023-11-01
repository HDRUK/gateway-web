import { useHasPermissions } from "@/hooks/useHasPermission";
import useAuth from "@/hooks/useAuth";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";
import { server } from "@/mocks/server";
import { getTeamV1 } from "@/mocks/handlers/teams";
import { teamV1 } from "@/mocks/data/team";
import { userV1 } from "@/mocks/data/user";
import { Role } from "@/interfaces/Role";
import { renderHook, waitFor } from "@/utils/testUtils";
import mockRouter from "next-router-mock";

jest.mock("@/hooks/useAuth", () => jest.fn());

describe("useHasPermissions", () => {
    it("should return permissions based on team roles", async () => {
        server.use(
            getTeamV1({
                ...teamV1,
                id: 1,
                users: [
                    {
                        ...userV1,
                        id: teamV1.users[0].id,
                        roles: [
                            {
                                ...teamV1.users[0].roles[0],
                                enabled: true,
                                name: ROLE_CUSTODIAN_TEAM_ADMIN,
                            },
                        ],
                    },
                ],
            })
        );

        const userRoles: Role[] = [];

        mockRouter.query = { teamId: "1" };

        (useAuth as jest.Mock).mockReturnValue({
            user: {
                id: teamV1.users[0].id,
                roles: userRoles,
            },
        });

        const { result } = renderHook(() => useHasPermissions());

        await waitFor(() => {
            expect(
                (result.current as { [key: string]: boolean })[
                    "fe.account.team_management.member.delete"
                ]
            ).toBeTruthy();
        });

        await waitFor(() => {
            expect(
                (result.current as { [key: string]: boolean })[
                    "fe.account.nav.dar.applications.read"
                ]
            ).toBeFalsy();
        });
    });
});
