import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { filterV1, generateFilterV1 } from "@/mocks/data";
import apiService from "@/services/api";

describe("put", () => {
    it("should return put payload", async () => {
        const payload = generateFilterV1();
        const response = await apiService.putRequest<Filter>(
            `${config.filtersV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    t: jest.fn(),
                    i18n: expect.any(Function),
                    notificationsOn: false,
                },
            }
        );
        expect(response).toEqual(filterV1);
    });
});
