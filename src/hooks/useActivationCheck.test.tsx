import { rest } from "msw";
import * as yup from "yup";
import useActivationCheck from "@/hooks/useActivationCheck";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { FetchData } from "@/utils/activation";
import { renderHook } from "@/utils/testUtils";
import { server } from "@/mocks/server";

jest.mock("@/services/notification");

const entityUrl = `${apis.teamsV2Url}/1/tools/1`;
const schema = yup.object({ name: yup.string().required() });

const loadEntity = async (fetchData: FetchData) => {
    const entity = await fetchData<object>(entityUrl);

    return entity && { schema, values: entity };
};

const mockEntity = (entity: object) =>
    server.use(
        rest.get(entityUrl, (req, res, ctx) => res(ctx.json({ data: entity })))
    );

describe("useActivationCheck", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should pass an entity that is valid", async () => {
        mockEntity({ name: "Tool" });
        const { result } = renderHook(() => useActivationCheck());

        expect(await result.current({ load: loadEntity })).toBe(true);
        expect(notificationService.apiError).not.toHaveBeenCalled();
    });

    it("should block an invalid entity and show a notification", async () => {
        mockEntity({ name: "" });
        const { result } = renderHook(() => useActivationCheck());

        expect(await result.current({ load: loadEntity })).toBe(false);
        expect(notificationService.apiError).toHaveBeenCalledTimes(1);
    });

    it("should block without a notification when nothing is loaded", async () => {
        const { result } = renderHook(() => useActivationCheck());

        expect(await result.current({ load: async () => null })).toBe(false);
        expect(notificationService.apiError).not.toHaveBeenCalled();
    });

    it("should block and show a notification when the check throws", async () => {
        const { result } = renderHook(() => useActivationCheck());

        expect(
            await result.current({
                load: async () => {
                    throw new Error("Unexpected data");
                },
            })
        ).toBe(false);
        expect(notificationService.apiError).toHaveBeenCalledTimes(1);
    });
});
