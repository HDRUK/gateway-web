import { act } from "@testing-library/react";
import { renderHook } from "@/utils/testUtils";
import { STATIC_FILTER_DATA_SOURCE, STATIC_FILTER_SOURCE } from "../constants";
import { useStaticFilterUpdate } from "./useStaticFilterUpdate";

describe("useStaticFilterUpdate", () => {
    const setSearchParams = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    const setup = () =>
        renderHook(() => useStaticFilterUpdate(setSearchParams));

    it(`sets only the value for "${STATIC_FILTER_DATA_SOURCE}"`, () => {
        const { result } = setup();

        act(() => result.current(STATIC_FILTER_DATA_SOURCE, "ARDC"));

        expect(setSearchParams).toHaveBeenCalledWith({
            [STATIC_FILTER_DATA_SOURCE]: "ARDC",
        });
    });

    it("clears the query and dataset titles for other filters", () => {
        const { result } = setup();

        act(() => result.current(STATIC_FILTER_SOURCE, "FED"));

        expect(setSearchParams).toHaveBeenCalledWith({
            [STATIC_FILTER_SOURCE]: "FED",
            datasetTitles: undefined,
            query: undefined,
        });
    });
});
