import { Application } from "@/interfaces/Application";
import apiService from "@/services/api";
import * as apiUtils from "@/services/api/utils";
import apis from "@/config/apis";
import { applicationV1, generateApplicationV1 } from "@/mocks/data/application";
import { patchApplicationV1 } from "@/mocks/handlers/application";
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

describe("patch", () => {
    it("should return the PATCH payload on api success", async () => {
        const payload = generateApplicationV1();
        const response = await apiService.patchRequest<Application>(
            `${apis.applicationsV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    ...translationProps,
                    successNotificationsOn: false,
                    errorNotificationsOn: false,
                },
            }
        );
        expect(response).toEqual(applicationV1);
        expect(apiUtils.successNotification).not.toHaveBeenCalled();
        expect(apiUtils.errorNotification).not.toHaveBeenCalled();
    });
    it("should call the success notification on api success", async () => {
        const payload = generateApplicationV1();
        await apiService.patchRequest<Application>(
            `${apis.applicationsV1Url}/${payload.id}`,
            payload,
            {
                notificationOptions: {
                    ...translationProps,
                },
            }
        );
        expect(apiUtils.successNotification).toHaveBeenCalledWith({
            method: "patch",
            props: { ...translationProps },
        });
    });
    it("should call the error notification on api error", async () => {
        server.use(patchApplicationV1(undefined, 401));
        const payload = generateApplicationV1();
        try {
            await apiService.patchRequest<Application>(
                `${apis.applicationsV1Url}/${payload.id}`,
                payload,
                {
                    notificationOptions: {
                        ...translationProps,
                    },
                }
            );
            expect(apiUtils.errorNotification).toHaveBeenCalledWith({
                errorResponse: expect.any(Object),
                method: "patch",
                props: {
                    ...translationProps,
                },
            });
        } catch (e) {
            /* empty */
        }
    });
});
