import { Role } from "@/interfaces/Role";
import {
    ROLE_CUSTODIAN_TEAM_ADMIN,
    ROLE_HDRUK_SUPERADMIN,
} from "@/consts/roles";
import { generateRoleV1 } from "@/mocks/data";
import { getPermissions } from "./permissions";

const userRoles: Role[] = [
    generateRoleV1({
        name: ROLE_HDRUK_SUPERADMIN,
        permissions: [{ name: "dur.read" }],
        enabled: true,
    }),
];

const teamRoles: Role[] = [
    generateRoleV1({
        name: ROLE_CUSTODIAN_TEAM_ADMIN,
        permissions: [{ name: "custodians.delete" }],
        enabled: true,
    }),
];

describe("Permissions utils", () => {
    it("should return a permissions object for team admin", () => {
        const result = getPermissions([], teamRoles);
        expect(result["custodians.delete"]).toBeTruthy();
        expect(result["dur.read"]).toBeFalsy();
    });
    it("should return a permissions object for team admin and superadmin", () => {
        const result = getPermissions(userRoles, teamRoles);

        expect(result["custodians.delete"]).toBeTruthy();
        expect(result["dur.read"]).toBeTruthy();
    });

    it("should handle empty userRoles and teamRoles", () => {
        const result = getPermissions([], []);

        expect(result["custodians.delete"]).toBeFalsy();
        expect(result["dur.read"]).toBeFalsy();
    });
});
