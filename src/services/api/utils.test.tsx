import { errorNotification, successNotification } from "@/services/api/utils";
import * as notificationService from "@/services/notification/notification";
import { errorResponseV1 } from "@/mocks/data/api/v1";

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
            },
        });
        expect(notificationService.apiError).toBeCalledWith(
            "common.error.put.message",
            {
                errors: undefined,
                message: "common.error.put.message",
                title: "common.error.status.404",
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
            },
        });
        expect(notificationService.apiSuccess).toBeCalledWith(
            "common.success.put.message",
            {}
        );
    });

    it("successNotification: calls t with default 'Item' label", () => {
        const tMock = jest.fn();
        successNotification({
            method: "put",
            props: {
                t: tMock,
            },
        });
        expect(tMock).toBeCalledWith("common.success.put.message", {
            item: "Item",
        });
    });

    it("successNotification: calls t with passed 'itemName' prop", () => {
        const tMock = jest.fn();
        successNotification({
            method: "put",
            props: {
                t: tMock,
                itemName: "anItemName",
            },
        });
        expect(tMock).toBeCalledWith("common.success.put.message", {
            item: "anItemName",
        });
    });
    it("successNotification: with custom message from locale file", () => {
        successNotification({
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
                localeKey: "applicationPermission",
            },
        });
        expect(notificationService.apiSuccess).toBeCalledWith(
            "applicationPermission.success.put.message",
            { localeKey: "applicationPermission" }
        );
    });
});
