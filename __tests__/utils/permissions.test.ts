import { getPermissions } from "@/utils/permissions";
import { Role } from "@/interfaces/Role";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";

// todo: Update test once roles in implemented in BE User api
const userRoles: Role[] = [];

const teamRoles: string[] = [ROLE_CUSTODIAN_TEAM_ADMIN];

describe("permissions", () => {
    it("should return a permissions object with correct values", () => {
        const result = getPermissions(userRoles, teamRoles);

        expect(result["account.team_management.member.delete"]).toBe(true);
        expect(result["account.nav.dur.read"]).toBe(false);
    });

    it("should handle empty userRoles and teamRoles", () => {
        const result = getPermissions([], []);

        expect(result["account.team_management.member.delete"]).toBe(false);
        expect(result["account.nav.dur.read"]).toBe(false);
    });
});
