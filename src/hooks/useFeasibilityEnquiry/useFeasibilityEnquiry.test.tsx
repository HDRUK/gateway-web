import { renderHook } from "@/utils/testUtils";
import { datasetSearchResultV1 } from "@/mocks/data";
import useFeasibilityEnquiry from "./useFeasibilityEnquiry";

const mockMutateLibraries = jest.fn();
const mockShowDialog = jest.fn();

const mockedCommonArgs = {
    isLoggedIn: true,
    dataset: datasetSearchResultV1,
    mutateLibraries: mockMutateLibraries,
};

jest.mock("@/hooks/useDialog", () => () => ({
    showDialog: mockShowDialog,
}));

describe("useFeasibilityEnquiry", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("shows the feasibility enquiry modal", () => {
        const { result } = renderHook(() => useFeasibilityEnquiry());

        if (result.current) {
            result.current(mockedCommonArgs);

            const {
                _id,
                metadata,
                team: { name, member_of, id },
            } = datasetSearchResultV1;

            expect(mockShowDialog).toHaveBeenCalledWith(expect.any(Function), {
                result: {
                    datasetId: Number(_id),
                    name: metadata.summary.title,
                    teamId: id,
                    teamName: name,
                    teamMemberOf: member_of,
                },
                mutateLibraries: expect.any(Function),
            });
        } else {
            fail("No callback was returned");
        }
    });

    it("shows the provider modal", () => {
        const { result } = renderHook(() => useFeasibilityEnquiry());

        if (result.current) {
            result.current({
                ...mockedCommonArgs,
                isLoggedIn: false,
            });

            expect(mockShowDialog).toHaveBeenCalledWith(expect.any(Function), {
                isProvidersDialog: true,
            });
        } else {
            fail("No callback was returned");
        }
    });
});
