import apis from "@/config/apis";
import { Filter } from "@/interfaces/Filter";
import { filtersV1 } from "@/mocks/data";
import apiService from "@/services/api";

describe("get", () => {
    it("should return filters", async () => {
        const response = await apiService.getRequest<Filter[]>(
            apis.filtersV1Url,
            {
                notificationOptions: {
                    successNotificationsOn: false,
                    errorNotificationsOn: false,
                    t: jest.fn(),
                    i18n: expect.any(Function),
                },
            }
        );
        expect(response).toEqual(filtersV1);
    });
});
