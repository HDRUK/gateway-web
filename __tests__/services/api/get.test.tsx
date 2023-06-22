import vars from "@/config/vars";
import { Filter } from "@/interfaces/Filter";
import { filtersV1 } from "@/mocks/data";
import apiService from "@/services/api";

describe("get", () => {
    it("should return filters", async () => {
        const response = await apiService.getRequest<Filter[]>(
            vars.filtersV1Url,
            {
                notificationOptions: {
                    notificationsOn: false,
                    t: jest.fn(),
                    i18n: expect.any(Function),
                },
            }
        );
        expect(response).toEqual(filtersV1);
    });
});
