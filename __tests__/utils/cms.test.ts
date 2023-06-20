import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import * as apiService from "@/services/api/post";
import { getReleaseNotes, fetchFromCMS } from "@/utils/cms";
import vars from "@/config/vars";

jest.mock("@/services/api/post", () => {
    return {
        ...jest.requireActual("@/services/api/post"),
        postRequest: jest.fn(),
        __esModule: true,
    };
});

describe("cms utils", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("fetchFromCMS", () => {
        it("should call postRequest with correct params", () => {
            const mockQuery = `
          query MockQuery {
            items(where:{categoryName: "mock-query"}) {
              edges 
            }
          }
          `;
            fetchFromCMS(mockQuery);
            expect(apiService.postRequest).toBeCalledWith(
                vars.wordPressApiUrl,
                { query: mockQuery, variables: undefined },
                { notificationOptions: { notificationsOn: false } }
            );
        });
    });
    describe("getReleaseNotes", () => {
        it("should call post with release note params", async () => {
            await getReleaseNotes();
            expect(apiService.postRequest).toBeCalledWith(
                vars.wordPressApiUrl,
                { query: GetReleaseNotesQuery, variables: undefined },
                { notificationOptions: { notificationsOn: false } }
            );
        });
    });
});
