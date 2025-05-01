import useGTMEvent from "@/hooks/useGTMEvent";
import { renderHook } from "@/utils/testUtils";

describe("useGTMEvent", () => {
    beforeEach(() => {
        window.dataLayer = [];
    });

    afterEach(() => {
        window.dataLayer = [];
    });

    it("should push a GTM event with custom parameters", () => {
        const { result } = renderHook(() => useGTMEvent());

        result.current({
            event: "filter_applied",
            filter_name: "Location",
            filter_value: "LOCAL",
            search_term: "cancer",
        });

        expect(window.dataLayer).toEqual([
            {
                event: "filter_applied",
                filter_name: "Location",
                filter_value: "LOCAL",
                search_term: "cancer",
            },
        ]);
    });

    it("should not throw if dataLayer is undefined", () => {
        delete window.dataLayer;

        const { result } = renderHook(() => useGTMEvent());

        expect(() =>
            result.current({
                event: "filter_unapplied",
                filter_name: "Organisation",
                filter_value: "NHS",
                search_term: "diabetes",
            })
        ).not.toThrow();
    });
});
