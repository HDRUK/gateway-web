import Cookies from "js-cookie";
import config from "@/config/config";
import { PostLoginActions } from "@/consts/postLoginActions";
import { renderHook, waitFor } from "@/utils/testUtils";
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

jest.mock("js-cookie");

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
                team: { name, id },
            } = datasetSearchResultV1;

            expect(mockShowDialog).toHaveBeenCalledWith(expect.any(Function), {
                result: {
                    datasetId: Number(_id),
                    name: metadata.summary.title,
                    teamId: id,
                    teamName: name,
                },
                mutateLibraries: expect.any(Function),
            });
        } else {
            fail("No callback was returned");
        }
    });

    it("shows the provider modal when not logged in, and sets post-login action cookie", async () => {
        const { result } = renderHook(() => useFeasibilityEnquiry());

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

        const { _id, team, metadata } = datasetSearchResultV1;

        await waitFor(() => {
            expect(Cookies.set).toHaveBeenCalledWith(
                config.POST_LOGIN_ACTION_COOKIE,
                JSON.stringify({
                    action: PostLoginActions.OPEN_FEASIBILITY_ENQUIRY,
                    dataset: {
                        datasetId: Number(_id),
                        name: metadata.summary.title,
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
