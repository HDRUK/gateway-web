import config from "@/config";
import { Filter, FilterType } from "@/interfaces/Filter";
import { filterV1 } from "@/mocks/data";
import { postFilterV1 } from "@/mocks/handlers/filters";
import { server } from "@/mocks/server";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";

jest.mock("@/services/api/utils", () => {
    return {
        ...jest.requireActual("@/services/api/utils"),
        successNotification: jest.fn(),
        errorNotification: jest.fn(),
        __esModule: true,
    };
});

const translationProps = {
    t: expect.any(Function),
    i18n: expect.any(Object),
};

describe("post", () => {
    it("should return the POST payload on api success", async () => {
        const payload = {
            type: "features" as FilterType,
        };
        const response = await apiService.postRequest<Filter>(
            config.filtersV1Url,
            payload,
            {
                notificationOptions: {
                    notificationsOn: false,
                    ...translationProps,
                },
            }
        );
        expect(response).toEqual(filterV1);
        expect(apiUtils.successNotification).not.toHaveBeenCalled();
        expect(apiUtils.errorNotification).not.toHaveBeenCalled();
    });

    it("should call the success notification on api success", async () => {
        const payload = {
            type: "features" as FilterType,
        };
        await apiService.postRequest<Filter>(config.filtersV1Url, payload, {
            notificationOptions: {
                notificationsOn: true,
                ...translationProps,
            },
        });
        expect(apiUtils.successNotification).toHaveBeenCalledWith({
            method: "post",
            props: { ...translationProps },
        });
    });

    it("should call the error notification on api error", async () => {
        server.use(postFilterV1(undefined, 401));
        const payload = {
            type: "features" as FilterType,
        };
        await apiService.postRequest<Filter>(config.filtersV1Url, payload, {
            notificationOptions: {
                notificationsOn: true,
                ...translationProps,
            },
        });
        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            errorResponse: expect.any(Object),
            method: "post",
            props: {
                ...translationProps,
            },
        });
    });
});
