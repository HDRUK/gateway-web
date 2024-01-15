import { Filter } from "@/interfaces/Filter";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import apis from "@/config/apis";
import { filtersV1 } from "@/mocks/data";
import { getFiltersV1 } from "@/mocks/handlers/filters";
import { server } from "@/mocks/server";

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
            },
        });

        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            errorResponse: expect.objectContaining({
                data: "Request failed with status code 401",
            }),
            method: "get",
            props: expect.any(Object),
        });
    });
});
