import { renderHook } from "@/utils/testUtils";
import { datasetSearchResultV1 } from "@/mocks/data";
import useGeneralEnquiry from "./useGeneralEnquiry";

const mockMutateLibraries = jest.fn();
const mockShowDialog = jest.fn();
const mockShowSidebar = jest.fn();

const mockedCommonArgs = {
    isLoggedIn: true,
    dataset: datasetSearchResultV1,
    mutateLibraries: mockMutateLibraries,
};

jest.mock("@/hooks/useDialog", () => () => ({
    showDialog: mockShowDialog,
}));

jest.mock("@/hooks/useSidebar", () => () => ({
    showSidebar: mockShowSidebar,
}));

describe("useGeneralEnquiry", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("shows the general enquiry modal", () => {
        const { result } = renderHook(() => useGeneralEnquiry());

        if (result.current) {
            result.current(mockedCommonArgs);

            expect(mockShowSidebar).toHaveBeenCalledWith({
                title: "Messages",
                content: expect.anything(),
            });
        } else {
            fail("No callback was returned");
        }
    });

    it("shows the provider modal", () => {
        const { result } = renderHook(() => useGeneralEnquiry());

        if (result.current) {
            result.current({
                ...mockedCommonArgs,
                isLoggedIn: false,
            });

            expect(mockShowDialog).toHaveBeenCalledWith(expect.any(Function), {
                isProvidersDialog: true,
                redirectPath: "/",
            });
        } else {
            fail("No callback was returned");
        }
    });
});
