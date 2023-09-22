import { getPermissions } from "@/utils/permissions";
import { Role } from "@/interfaces/Role";
import {
    ROLE_CUSTODIAN_TEAM_ADMIN,
    ROLE_HDRUK_SUPERADMIN,
} from "@/consts/roles";
import { generateRoleV1 } from "@/mocks/data";

const userRoles: Role[] = [
    generateRoleV1({
        name: ROLE_HDRUK_SUPERADMIN,
        permissions: [],
        enabled: true,
    }),
];

const teamRoles: Role[] = [
    generateRoleV1({
        name: ROLE_CUSTODIAN_TEAM_ADMIN,
        permissions: [],
        enabled: true,
    }),
];

describe("Permissions utils", () => {
    it("should return a permissions object for team admin", () => {
        const result = getPermissions([], teamRoles);

        expect(result["fe.account.team_management.member.delete"]).toBeTruthy();
        expect(result["fe.account.nav.dur"]).toBeFalsy();
    });
    it("should return a permissions object for team admin and superadmin", () => {
        const result = getPermissions(userRoles, teamRoles);

        expect(result["fe.account.team_management.member.delete"]).toBeTruthy();
        expect(result["fe.account.nav.dur"]).toBeTruthy();
    });

    it("should handle empty userRoles and teamRoles", () => {
        const result = getPermissions([], []);

        expect(result["fe.account.team_management.member.delete"]).toBeFalsy();
        expect(result["fe.account.nav.dur"]).toBeFalsy();
    });
});
