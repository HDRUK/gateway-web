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
            error: {
                ...expect.any(Object),
            },
            status: 404,
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
                title: "common.error.status.404",
            }
        );
    });
    it("errorNotification - with title from locale config (based on the status)", () => {
        const error = errorResponseV1();
        errorNotification({
            status: 401,
            error,
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
            },
        });
        expect(notificationService.apiError).toBeCalledWith(error.message, {
            errors: error.errors,
            title: "common.error.status.401",
        });
    });
    it("errorNotification - with fallback title", () => {
        const unknownError = 342432;
        const error = errorResponseV1();
        errorNotification({
            status: unknownError,
            error,
            method: "put",
            props: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t: (str: any) => str,
            },
        });
        expect(notificationService.apiError).toBeCalledWith(error.message, {
            title: "There has been an error",
            errors: error.errors,
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

    it("successNotification: calls t with default 'item' label", () => {
        const tMock = jest.fn();
        successNotification({
            method: "put",
            props: {
                t: tMock,
            },
        });
        expect(tMock).toBeCalledWith("common.success.put.message", {
            item: "item",
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
