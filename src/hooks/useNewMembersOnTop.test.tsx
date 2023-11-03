import { server } from "@/mocks/server";
import { getTeamV1 } from "@/mocks/handlers/teams";
import { teamV1 } from "@/mocks/data/team";
import { generateUserV1 } from "@/mocks/data/user";
import { renderHook, waitFor } from "@/utils/testUtils";
import mockRouter from "next-router-mock";
import { useNewMembersOnTop } from "./useNewMembersOnTop";

describe("useNewMembersOnTop", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return teamUsers", async () => {
        const user1 = generateUserV1();
        const user2 = generateUserV1();
        const user3 = generateUserV1();
        server.use(
            getTeamV1({
                ...teamV1,
                users: [user1, user2, user3],
            })
        );

        mockRouter.query = { teamId: teamV1.id.toString() };

        const { result } = renderHook(() => useNewMembersOnTop());

        await waitFor(() => {
            expect(result.current.teamMembers).toEqual([user1, user2, user3]);
        });
    });
    it("should return teamUsers with new user(s) on top", async () => {
        const user1 = generateUserV1();
        const user2 = generateUserV1();
        const user3 = generateUserV1();
        server.use(
            getTeamV1({
                ...teamV1,
                users: [user1, user2, user3],
            })
        );

        mockRouter.query = { teamId: teamV1.id.toString() };

        const { result } = renderHook(() => useNewMembersOnTop());

        result.current.onAddNewMembers([user2.id]);

        await waitFor(() => {
            expect(result.current.teamMembers).toEqual([user2, user1, user3]);
        });
    });
});
