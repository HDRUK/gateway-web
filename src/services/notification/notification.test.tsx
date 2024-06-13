import * as notistack from "notistack";
import notificationService from "@/services/notification";

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    enqueueSnackbar: jest.fn(),
}));

describe("Notification Service", () => {
    it("should call correct props for `apiError` notification", () => {
        notificationService.apiError("mockMessage");
        expect(notistack.enqueueSnackbar).toBeCalledWith("mockMessage", {
            anchorOrigin: {
                horizontal: "right",
                vertical: "top",
            },
            persist: true,
            variant: "apiError",
        });
    });

    it("should call correct props for `error` notification", () => {
        notificationService.error("mockMessage");
        expect(notistack.enqueueSnackbar).toBeCalledWith("mockMessage", {
            anchorOrigin: {
                horizontal: "right",
                vertical: "top",
            },
            variant: "error",
        });
    });

    it("should call correct props for `success` notification", () => {
        notificationService.success("mockMessage");
        expect(notistack.enqueueSnackbar).toBeCalledWith("mockMessage", {
            anchorOrigin: {
                horizontal: "right",
                vertical: "top",
            },
            variant: "success",
        });
    });

    it("should call correct props for `warning` notification", () => {
        notificationService.warning("mockMessage");
        expect(notistack.enqueueSnackbar).toBeCalledWith("mockMessage", {
            anchorOrigin: {
                horizontal: "right",
                vertical: "top",
            },
            variant: "warning",
        });
    });

    it("should call correct props for `info` notification", () => {
        notificationService.info("mockMessage");
        expect(notistack.enqueueSnackbar).toBeCalledWith("mockMessage", {
            anchorOrigin: {
                horizontal: "right",
                vertical: "top",
            },
            variant: "info",
        });
    });
});
