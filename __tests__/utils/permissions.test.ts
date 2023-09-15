import { getPermissions } from "@/utils/permissions";
import { Role } from "@/interfaces/Role";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";

// todo: Replace with mocked Permission
const userRoles: Role[] = [];

// todo: Replace with mocked Permission
const teamRoles: Role[] = [
    { name: ROLE_CUSTODIAN_TEAM_ADMIN, permissions: [], enabled: true },
];

describe("permissions", () => {
    it("should return a permissions object with correct values", () => {
        const result = getPermissions(userRoles, teamRoles);

        expect(result["fe.account.team_management.member.delete"]).toBeTruthy();
        expect(result["fe.account.nav.dur"]).toBeFalsy();
    });

    it("should handle empty userRoles and teamRoles", () => {
        const result = getPermissions([], []);

        expect(result["fe.account.team_management.member.delete"]).toBeFalsy();
        expect(result["fe.account.nav.dur"]).toBeFalsy();
    });
});
