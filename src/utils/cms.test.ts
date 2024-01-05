import apis from "@/config/apis";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetTermsAndConditionsQuery } from "@/config/queries/termsAndConditions";
import {
    getReleaseNotes,
    getMissionAndPurposes,
    getTermsAndConditions,
} from "@/utils/cms";

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
    describe("getTermsAndConditions", () => {
        it("should call fetch with correct params", async () => {
            await getTermsAndConditions();
            expect(window.fetch).toBeCalledWith(apis.wordPressApiUrl, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ query: GetTermsAndConditionsQuery }),
                next: { revalidate: 10 },
            });
        });
    });
});
