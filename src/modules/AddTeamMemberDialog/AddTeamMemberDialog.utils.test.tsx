import { generateUserV1 } from "@/mocks/data";
import { getAvailableUsers } from "./AddTeamMemberDialog.utils";

describe("AddTeamMemberDialog", () => {
    describe("getAvailableUsers", () => {
        it("should not list existing team members", () => {
            const user1 = generateUserV1({ id: 1 });
            const user2 = generateUserV1({ id: 2 });
            const existingTeamMembers = [user2];
            const allUsers = [user1, user2];

            const expectedResponse = [{ label: user1.name, value: user1.id }];
            expect(getAvailableUsers(existingTeamMembers, allUsers)).toEqual(
                expectedResponse
            );
        });
    });
});
