import apis from "@/config/apis";
import { Filter } from "@/interfaces/Filter";
import { filtersV1 } from "@/mocks/data";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import { server } from "@/mocks/server";
import { getFiltersV1 } from "@/mocks/handlers/filters";

jest.mock("@/services/api/utils", () => {
    return {
        ...jest.requireActual("@/services/api/utils"),
        successNotification: jest.fn(),
        errorNotification: jest.fn(),
        __esModule: true,
    };
});

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
    it("should call the error notification on api error", async () => {
        server.use(getFiltersV1(undefined, 401));

        await apiService.getRequest<Filter>(apis.filtersV1Url, {
            notificationOptions: {
                successNotificationsOn: false,
                errorNotificationsOn: true,
                t: jest.fn(),
                i18n: expect.any(Function),
            },
        });

        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            errorResponse: "ra",
            method: "get",
            props: expect.any(Object),
        });
    });
});
