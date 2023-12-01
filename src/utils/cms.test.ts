import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { getReleaseNotes, getMissionAndPurposes } from "@/utils/cms";
import apis from "@/config/apis";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";

describe("CMS utils", () => {
    beforeAll(() => jest.spyOn(window, "fetch"));

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getReleaseNotes", () => {
        it("should call fetch with correct params", async () => {
            await getReleaseNotes();
            expect(window.fetch).toBeCalledWith(apis.wordPressApiUrl, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ query: GetReleaseNotesQuery }),
                next: { revalidate: 10 },
            });
        });
    });
    describe("getMissionAndPurposes", () => {
        it("should call fetch with correct params", async () => {
            await getMissionAndPurposes();
            expect(window.fetch).toBeCalledWith(apis.wordPressApiUrl, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ query: GetMissionAndPurposesQuery }),
                next: { revalidate: 10 },
            });
        });
    });
});
