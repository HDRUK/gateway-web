import { act } from "@testing-library/react";
import { renderHook } from "@/utils/testUtils";
import { STATIC_FILTER_DATA_SOURCE } from "../constants";
import { useStaticFilterUpdate } from "./useStaticFilterUpdate";

describe("useStaticFilterUpdate", () => {
    const setQueryParams = jest.fn();
    const updatePath = jest.fn();
    const updatePathMultiple = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    const setup = () =>
        renderHook(() =>
            useStaticFilterUpdate({ setQueryParams, updatePath, updatePathMultiple })
        );

    const getUpdater = () =>
        setQueryParams.mock.calls[0][0] as (prev: object) => object;

    describe(`when filterName is "${STATIC_FILTER_DATA_SOURCE}"`, () => {
        it("calls updatePathMultiple with the value and page reset", () => {
            const { result } = setup();
            act(() => result.current(STATIC_FILTER_DATA_SOURCE, "ARDC"));
            expect(updatePathMultiple).toHaveBeenCalledWith({
                [STATIC_FILTER_DATA_SOURCE]: "ARDC",
                page: "1",
            });
        });

        it("does not call updatePath", () => {
            const { result } = setup();
            act(() => result.current(STATIC_FILTER_DATA_SOURCE, "ARDC"));
            expect(updatePath).not.toHaveBeenCalled();
        });

        it("sets the filter value and resets page in queryParams", () => {
            const { result } = setup();
            act(() => result.current(STATIC_FILTER_DATA_SOURCE, "ARDC"));
            const prev = { dataSource: "HDRUK", page: "3", query: "cancer" };
            expect(getUpdater()(prev)).toMatchObject({
                dataSource: "ARDC",
                page: "1",
                query: "cancer",
            });
        });
    });

    describe("when filterName is any other filter", () => {
        it("calls updatePath with the filterName and value", () => {
            const { result } = setup();
            act(() => result.current("publisherName", "NHS"));
            expect(updatePath).toHaveBeenCalledWith("publisherName", "NHS");
        });

        it("does not call updatePathMultiple", () => {
            const { result } = setup();
            act(() => result.current("publisherName", "NHS"));
            expect(updatePathMultiple).not.toHaveBeenCalled();
        });

        it("sets the filter value, clears datasetTitles and query in queryParams", () => {
            const { result } = setup();
            act(() => result.current("publisherName", "NHS"));
            const prev = {
                publisherName: [],
                datasetTitles: ["existing"],
                query: "cancer",
            };
            expect(getUpdater()(prev)).toMatchObject({
                publisherName: "NHS",
                datasetTitles: undefined,
                query: "",
            });
        });
    });
});
