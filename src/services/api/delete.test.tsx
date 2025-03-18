import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import apis from "@/config/apis";
import { generateNumber } from "@/mocks/data/generic";
import { deleteFilterV1 } from "@/mocks/handlers/filters";
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

describe("delete", () => {
    it("should return the DELETE payload api success", async () => {
        const response = await apiService.deleteRequest(
            `${apis.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    successNotificationsOn: false,
                    errorNotificationsOn: false,
                    ...translationProps,
                },
            }
        );
        expect(response).toEqual("success");
        expect(apiUtils.successNotification).not.toHaveBeenCalled();
        expect(apiUtils.errorNotification).not.toHaveBeenCalled();
    });
    it("should call the success notification on api success", async () => {
        await apiService.deleteRequest(
            `${apis.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    ...translationProps,
                },
            }
        );
        expect(apiUtils.successNotification).toHaveBeenCalledWith({
            method: "delete",
            props: { ...translationProps },
        });
    });
    it("should call the error notification on api error", async () => {
        server.use(deleteFilterV1(401));
        await apiService.deleteRequest(
            `${apis.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    ...translationProps,
                },
            }
        );

        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            error: expect.any(Object),
            status: 401,
            method: "delete",
            props: {
                ...translationProps,
            },
        });
    });
});
