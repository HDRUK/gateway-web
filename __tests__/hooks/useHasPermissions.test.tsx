import { useRouter } from "next/router";
import { useHasPermissions } from "@/hooks/useHasPermission";
import useAuth from "@/hooks/useAuth";
import useCustodianRoles from "@/hooks/useCustodianRoles";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";
import { renderHook } from "../testUtils";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => jest.fn());

jest.mock("@/hooks/useCustodianRoles", () => jest.fn());

describe("useHasPermissions", () => {
    it("should return permissions based on team roles", () => {
        // todo: Update test once roles in implemented in BE User api
        const userRoles: never[] = [];

        const teamRoles = [ROLE_CUSTODIAN_TEAM_ADMIN];

        (useRouter as jest.Mock).mockReturnValue({
            query: { teamId: "123" },
        });

        (useAuth as jest.Mock).mockReturnValue({
            user: {
                roles: userRoles,
            },
        });

        (useCustodianRoles as jest.Mock).mockReturnValue({
            list: teamRoles,
        });

        const { result } = renderHook(() => useHasPermissions());

        expect(
            (result.current as { [key: string]: boolean })[
                "fe.account.team_management.member.delete"
            ]
        ).toBeTruthy();
        expect(
            (result.current as { [key: string]: boolean })[
                "fe.account.nav.dar.applications.read"
            ]
        ).toBeFalsy();
    });
});
