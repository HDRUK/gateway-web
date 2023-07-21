import { errorResponseV1 } from "@/mocks/data/api/v1";
import { errorNotification, successNotification } from "@/services/api/utils";
import * as notificationService from "@/services/notification/notification";

jest.mock("notistack", () => {
    return {
        ...jest.requireActual("notistack"),
        enqueueSnackbar: jest.fn(),
        __esModule: true,
    };
});

jest.mock("@/services/notification/notification", () => {
    return {
        ...jest.requireActual("@/services/notification/notification"),
        apiError: jest.fn(),
        error: jest.fn(),
        apiSuccess: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
        __esModule: true,
    };
});

describe("Api Service - Utils", () => {
    const mockMissingLocalKey = false;
    const mockExistingLocalKey = true;

    it("errorNotification - with default title", () => {
        errorNotification({
            errorResponse: {
                status: 404,
                data: {},
                ...expect.any(Object),
            },
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                i18n: {
                    exists: () => mockExistingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(notificationService.apiError).toBeCalledWith(
            "api:common.error.put.message",
            {
                errors: undefined,
                message: "api:common.error.put.message",
                title: "api:common.error.status.404",
            }
        );
    });
    it("errorNotification - with title from locale config (based on the status)", () => {
        const error = errorResponseV1(404);
        errorNotification({
            errorResponse: {
                status: 404,
                data: error,
                ...expect.any(Object),
            },
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                i18n: {
                    exists: () => mockExistingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(notificationService.apiError).toBeCalledWith(error.message, {
            errors: error.errors,
            message: error.message,
            title: error.title,
        });
    });
    it("errorNotification - with fallback title", () => {
        const unknownError = 342432;
        const error = errorResponseV1(unknownError);
        errorNotification({
            errorResponse: {
                status: unknownError,
                data: error,
                ...expect.any(Object),
            },
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                i18n: {
                    exists: () => mockMissingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(notificationService.apiError).toBeCalledWith(error.message, {
            errors: error.errors,
            message: error.message,
            title: error.title,
        });
    });

    it("successNotification with common message", () => {
        successNotification({
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                i18n: {
                    exists: () => mockMissingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(notificationService.apiSuccess).toBeCalledWith(
            "api:common.success.put.message",
            {}
        );
    });

    it("successNotification: calls t with default 'Item' label", () => {
        const tMock = jest.fn();
        successNotification({
            method: "put",
            props: {
                t: tMock,
                i18n: {
                    exists: () => mockMissingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(tMock).toBeCalledWith("api:common.success.put.message", {
            item: "Item",
        });
    });

    it("successNotification: calls t with passed 'itemName' prop", () => {
        const tMock = jest.fn();
        successNotification({
            method: "put",
            props: {
                t: tMock,
                i18n: {
                    exists: () => mockMissingLocalKey,
                    ...expect.any(Object),
                },
                itemName: "anItemName",
            },
        });
        expect(tMock).toBeCalledWith("api:common.success.put.message", {
            item: "anItemName",
        });
    });
    it("successNotification: with cutom message from locale file", () => {
        successNotification({
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                localeKey: "aLocaleKey",
                i18n: {
                    exists: () => mockExistingLocalKey,
                    ...expect.any(Object),
                },
            },
        });
        expect(notificationService.apiSuccess).toBeCalledWith(
            "api:aLocaleKey.success.put.message",
            { localeKey: "aLocaleKey" }
        );
    });
});
