import mockRouter from "next-router-mock";
import { Role } from "@/interfaces/Role";
import useAuth from "@/hooks/useAuth";
import { useHasPermissions } from "@/hooks/useHasPermission";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";
import { renderHook, waitFor } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";
import { generatePermissionV1, userV1 } from "@/mocks/data/user";
import { getTeamV1 } from "@/mocks/handlers/teams";
import { server } from "@/mocks/server";

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
                                permissions: [
                                    generatePermissionV1({
                                        name: "custodians.delete",
                                    }),
                                ],
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
                    "custodians.delete"
                ]
            ).toBeTruthy();
        });

        await waitFor(() => {
            expect(
                (result.current as { [key: string]: boolean })[
                    "application.read"
                ]
            ).toBeFalsy();
        });
    });
});
