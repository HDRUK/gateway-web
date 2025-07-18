import Cookies from "js-cookie";
import config from "@/config/config";
import { PostLoginActions } from "@/consts/postLoginActions";
import { renderHook, waitFor } from "@/utils/testUtils";
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

jest.mock("js-cookie");

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

    it("shows the provider modal", async () => {
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

        const { _id, team } = datasetSearchResultV1;

        await waitFor(() => {
            expect(Cookies.set).toHaveBeenCalledWith(
                config.POST_LOGIN_ACTION_COOKIE,
                JSON.stringify({
                    action: PostLoginActions.OPEN_GENERAL_ENQUIRY,
                    dataset: {
                        datasetId: Number(_id) || null,
                        teamId: team.id,
                        teamName: team.name,
                    },
                }),
                {
                    path: "/",
                }
            );
        });
    });
});
