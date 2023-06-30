import apis from "@/config/apis";
import { Filter } from "@/interfaces/Filter";
import { filterV1, generateFilterV1 } from "@/mocks/data";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import { putFilterV1 } from "@/mocks/handlers/filters";
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
    i18n: expect.any(Object),
};

describe("put", () => {
    it("should return the PUT payload on api success", async () => {
        const payload = generateFilterV1();
        const response = await apiService.putRequest<Filter>(
            `${apis.filtersV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    ...translationProps,
                    successNotificationsOn: false,
                    errorNotificationsOn: false,
                },
            }
        );
        expect(response).toEqual(filterV1);
        expect(apiUtils.successNotification).not.toHaveBeenCalled();
        expect(apiUtils.errorNotification).not.toHaveBeenCalled();
    });
    it("should call the success notification on api success", async () => {
        const payload = generateFilterV1();
        await apiService.putRequest<Filter>(
            `${apis.filtersV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    ...translationProps,
                },
            }
        );
        expect(apiUtils.successNotification).toHaveBeenCalledWith({
            method: "put",
            props: { ...translationProps },
        });
    });
    it("should call the error notification on api error", async () => {
        server.use(putFilterV1(undefined, 401));
        const payload = generateFilterV1();
        await apiService.putRequest<Filter>(
            `${apis.filtersV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    ...translationProps,
                },
            }
        );
        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            errorResponse: expect.any(Object),
            method: "put",
            props: {
                ...translationProps,
            },
        });
    });
});
