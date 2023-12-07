import { teamV1 } from "@/mocks/data/team";
import { generateUserV1 } from "@/mocks/data/user";
import { renderHook, waitFor } from "@/utils/testUtils";
import { useNewMembersOnTop } from "./useNewMembersOnTop";

describe.skip("useNewMembersOnTop", () => {
    const user1 = generateUserV1();
    const user2 = generateUserV1();
    const user3 = generateUserV1();
    it("should return teamUsers", async () => {
        const mockTeam = {
            ...teamV1,
            users: [user1, user2, user3],
        };

        const { result } = renderHook(() => useNewMembersOnTop(mockTeam));

        await waitFor(() => {
            expect(result.current.teamMembers).toEqual([user1, user2, user3]);
        });
    });
    it("should return teamUsers with new user(s) on top", async () => {
        const mockTeam = {
            ...teamV1,
            users: [user1, user2, user3],
        };

        const { result } = renderHook(() => useNewMembersOnTop(mockTeam));

        result.current.onAddNewMembers([user2.id]);

        await waitFor(() => {
            expect(result.current.teamMembers).toEqual([user2, user1, user3]);
        });
    });
});
