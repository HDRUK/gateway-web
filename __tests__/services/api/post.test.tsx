import config from "@/config";
import { Filter, FilterType } from "@/interfaces/Filter";
import { filterV1 } from "@/mocks/data";
import apiService from "@/services/api";

describe("post", () => {
    it("should return post payload", async () => {
        const payload = {
            type: "features" as FilterType,
        };
        const response = await apiService.postRequest<Filter>(
            config.filtersV1Url,
            payload,
            {
                notificationOptions: {
                    notificationsOn: false,
                    t: jest.fn(),
                    i18n: expect.any(Function),
                },
            }
        );
        expect(response).toEqual(filterV1);
    });
});
