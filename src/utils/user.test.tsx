import { AuthTeam } from "@/interfaces/AuthTeam";
import { generateAuthTeamV1 } from "@/mocks/data/authTeam";
import { generateAuthUserV1 } from "@/mocks/data";
import { getProfileEmail, getRoleNamesByTeam, getTeamById } from "./user";

const teams: AuthTeam[] = [generateAuthTeamV1({ id: 1 })];

describe("User utils", () => {
    describe("getProfileEmail", () => {
        it("should return primary email if 'preferred_email' is set to 'primary'", () => {
            const mockUser = generateAuthUserV1({ preferred_email: "primary" });
            expect(getProfileEmail(mockUser)).toEqual(mockUser.email);
        });

        it("should return secondary email if 'preferred_email' is set to 'secondary'", () => {
            const mockUser = generateAuthUserV1({
                preferred_email: "secondary",
            });
            expect(getProfileEmail(mockUser)).toEqual(mockUser.secondary_email);
        });
    });
    describe("getTeamById", () => {
        it("should return the team with the specified ID", () => {
            const teamId = 1;
            const result = getTeamById(teams, teamId);

            expect(result).toEqual(teams[0]);
        });

        it("should return undefined when no matching team is found", () => {
            const teamId = 3;
            const result = getTeamById(teams, teamId);

            expect(result).toBeUndefined();
        });

        it("should return undefined when teams array is empty", () => {
            const teamId = 1;
            const result = getTeamById([], teamId);

            expect(result).toBeUndefined();
        });

        it("should return undefined when teamId is falsy", () => {
            const teamId = "";
            const result = getTeamById(teams, teamId);

            expect(result).toBeUndefined();
        });
    });

    describe("getRoleNamesByTeam", () => {
        it("should return an array of role names for a valid team", () => {
            const team = generateAuthTeamV1({
                roles: [
                    { id: 101, name: "Role 1" },
                    { id: 102, name: "Role 2" },
                ],
            });
            const result = getRoleNamesByTeam(team);

            expect(result).toEqual(["Role 1", "Role 2"]);
        });

        it("should return an empty array for a team with no roles", () => {
            const team = generateAuthTeamV1({
                roles: [],
            });
            const result = getRoleNamesByTeam(team);

            expect(result).toEqual([]);
        });

        it("should return an empty array for an undefined or null team", () => {
            const team = undefined;
            const result1 = getRoleNamesByTeam(team);

            const nullTeam = null;
            const result2 = getRoleNamesByTeam(nullTeam);

            expect(result1).toEqual([]);
            expect(result2).toEqual([]);
        });
    });
});
