import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import * as apiService from "@/services/api/post";
import { getReleaseNotes, fetchFromCMS } from "@/utils/cms";
import apis from "@/config/apis";

jest.mock("@/services/api/post", () => {
    return {
        ...jest.requireActual("@/services/api/post"),
        postRequest: jest.fn(),
        __esModule: true,
    };
});

describe("CMS utils", () => {
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
                apis.wordPressApiUrl,
                { query: mockQuery, variables: undefined },
                {
                    notificationOptions: {
                        successNotificationsOn: false,
                        errorNotificationsOn: false,
                    },
                }
            );
        });
    });
    describe("getReleaseNotes", () => {
        it("should call post with release note params", async () => {
            await getReleaseNotes();
            expect(apiService.postRequest).toBeCalledWith(
                apis.wordPressApiUrl,
                { query: GetReleaseNotesQuery, variables: undefined },
                {
                    notificationOptions: {
                        successNotificationsOn: false,
                        errorNotificationsOn: false,
                    },
                }
            );
        });
    });
});
