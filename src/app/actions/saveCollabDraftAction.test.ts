import { saveCollabDraft } from "@/utils/api";
import { saveCollabDraftAction } from "./saveCollabDraftAction";

jest.mock("@/utils/api", () => ({
    saveCollabDraft: jest.fn(),
}));

const TOKEN = "a".repeat(64);

const save = (token = TOKEN) =>
    saveCollabDraftAction({
        token,
        model: "HDRUK",
        version: "4.1.0",
        metadata: { summary: { title: "Example" } },
    });

describe("saveCollabDraftAction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (saveCollabDraft as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            body: {},
        });
    });

    it("sends the document in the declared schema's envelope", async () => {
        await save();

        expect(saveCollabDraft).toHaveBeenCalledWith(TOKEN, {
            metadata: {
                schemaModel: "HDRUK",
                schemaVersion: "4.1.0",
                metadata: { summary: { title: "Example" } },
            },
        });
    });

    it("never sends a status, so a collaborator can't activate the draft", async () => {
        await save();

        const payload = (saveCollabDraft as jest.Mock).mock.calls[0][1];
        expect(payload).not.toHaveProperty("status");
    });

    it.each([
        ["too short", "abc"],
        ["path traversal", `${"a".repeat(60)}/../`],
        ["query smuggling", `${"a".repeat(60)}?x=1`],
    ])("rejects a malformed token (%s) without calling the API", async (_, token) => {
        await expect(save(token)).resolves.toEqual({ ok: false });
        expect(saveCollabDraft).not.toHaveBeenCalled();
    });

    it("passes an API failure back with its status and body", async () => {
        (saveCollabDraft as jest.Mock).mockResolvedValue({
            ok: false,
            status: 422,
            body: { message: "Schema NOPE 9.9.9 is not offered" },
        });

        await expect(save()).resolves.toEqual({
            ok: false,
            status: 422,
            error: { message: "Schema NOPE 9.9.9 is not offered" },
        });
    });

    it("reports failure rather than throwing when the request errors", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        (saveCollabDraft as jest.Mock).mockRejectedValue(new Error("down"));

        await expect(save()).resolves.toEqual({ ok: false });
    });
});
