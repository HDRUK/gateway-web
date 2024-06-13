import { Filter, FilterType } from "@/interfaces/Filter";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import apis from "@/config/apis";
import { filterV1 } from "@/mocks/data";
import { postFilterV1 } from "@/mocks/handlers/filters";
import { server } from "@/mocks/server";

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
};

describe("post", () => {
    it("should return the POST payload on api success", async () => {
        const payload = {
            type: "features" as FilterType,
        };
        const response = await apiService.postRequest<Filter>(
            apis.filtersV1Url,
            payload,
            {
                notificationOptions: {
                    successNotificationsOn: false,
                    errorNotificationsOn: false,
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
        await apiService.postRequest<Filter>(apis.filtersV1Url, payload, {
            notificationOptions: {
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
        try {
            await apiService.postRequest<Filter>(apis.filtersV1Url, payload, {
                notificationOptions: {
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
        } catch (e) {
            /* empty */
        }
    });
});
