import useGetTeam from "@/hooks/useGetTeam";
import { renderHook, waitFor } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";

describe("useGetTeam", () => {
    it("should return initial response", async () => {
        const { result } = renderHook(() => useGetTeam(teamV1.id.toString()));

        await waitFor(() => {
            expect(result.current).toEqual({
                error: undefined,
                isTeamLoading: true,
                team: undefined,
                mutateTeam: expect.any(Function),
            });
        });
    });
    it("should return the loaded team", async () => {
        const { result } = renderHook(() => useGetTeam(teamV1.id.toString()));
        await waitFor(() => {
            expect(result.current).toEqual({
                error: undefined,
                isTeamLoading: false,
                team: teamV1,
                mutateTeam: expect.any(Function),
            });
        });
    });
});
