import config from "@/config";
import { generateNumber } from "@/mocks/data/generic";
import apiService from "@/services/api";

jest.mock("notistack", () => {
    return {
        ...jest.requireActual("notistack"),
        enqueueSnackbar: jest.fn(),
        __esModule: true,
    };
});

describe("delete", () => {
    it("should return delete payload", async () => {
        const response = await apiService.deleteRequest(
            `${config.filtersV1Url}/${generateNumber()}`,
            {
                notificationOptions: {
                    t: jest.fn(),
                    notificationsOn: false,
                    i18n: expect.any(Function),
                },
            }
        );
        expect(response).toEqual({ message: "success" });
    });
});
