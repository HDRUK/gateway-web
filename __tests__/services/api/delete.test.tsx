import vars from "@/config/vars";
import { generateNumber } from "@/mocks/data/generic";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
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
    i18n: expect.any(Object),
};

describe("delete", () => {
    it("should return the DELETE payload api success", async () => {
        const response = await apiService.deleteRequest(
            `${vars.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    notificationsOn: false,
                    ...translationProps,
                },
            }
        );
        expect(response).toEqual({ message: "success" });
        expect(apiUtils.successNotification).not.toHaveBeenCalled();
        expect(apiUtils.errorNotification).not.toHaveBeenCalled();
    });
    it("should call the success notification on api success", async () => {
        await apiService.deleteRequest(
            `${vars.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    ...translationProps,
                    notificationsOn: true,
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
            `${vars.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    notificationsOn: true,
                    ...translationProps,
                },
            }
        );

        expect(apiUtils.errorNotification).toHaveBeenCalledWith({
            errorResponse: expect.any(Object),
            method: "delete",
            props: {
                ...translationProps,
            },
        });
    });
});
