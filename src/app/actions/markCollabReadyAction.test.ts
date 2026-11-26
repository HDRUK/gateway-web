import { markCollabReady } from "@/utils/api";
import { markCollabReadyAction } from "./markCollabReadyAction";

jest.mock("@/utils/api", () => ({
    markCollabReady: jest.fn(),
}));

const TOKEN = "b".repeat(64);

describe("markCollabReadyAction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (markCollabReady as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            body: { data: { ready_for_review_at: "2026-11-20T10:00:00Z" } },
        });
    });

    it("marks the draft ready and returns when that happened", async () => {
        await expect(markCollabReadyAction(TOKEN, true)).resolves.toEqual({
            ok: true,
            readyForReviewAt: "2026-11-20T10:00:00Z",
        });
        expect(markCollabReady).toHaveBeenCalledWith(TOKEN, true);
    });

    it("can unmark the draft so the collaborator can keep editing", async () => {
        (markCollabReady as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            body: { data: { ready_for_review_at: null } },
        });

        await expect(markCollabReadyAction(TOKEN, false)).resolves.toEqual({
            ok: true,
            readyForReviewAt: null,
        });
        expect(markCollabReady).toHaveBeenCalledWith(TOKEN, false);
    });

    it("rejects a malformed token without calling the API", async () => {
        await expect(markCollabReadyAction("../teams", true)).resolves.toEqual({
            ok: false,
        });
        expect(markCollabReady).not.toHaveBeenCalled();
    });

    it("passes an API failure back with its status", async () => {
        (markCollabReady as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
            body: { message: "invalid or expired token" },
        });

        await expect(markCollabReadyAction(TOKEN, true)).resolves.toEqual({
            ok: false,
            status: 404,
            error: { message: "invalid or expired token" },
        });
    });
});
