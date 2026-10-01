import { Library } from "@/interfaces/Library";
import useAuth from "@/hooks/useAuth";
import useLibraryToggle from "@/hooks/useLibraryToggle";
import apiService from "@/services/api";
import apis from "@/config/apis";
import { act, renderHook, waitFor } from "@/utils/testUtils";
import { getLibrariesV1 } from "@/mocks/handlers/libraries";
import { server } from "@/mocks/server";

const libraryItem = { id: 7, dataset_id: 1 } as Library;

describe("useLibraryToggle", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns isInLibrary true when the dataset is in the library", async () => {
        server.use(getLibrariesV1([libraryItem]));
        const { result } = renderHook(() =>
            useLibraryToggle({ datasetId: 1, redirectPath: "/" })
        );

        await waitFor(() => {
            expect(result.current.isInLibrary).toBe(true);
        });
    });

    it("returns isInLibrary false when the dataset is not in the library", async () => {
        server.use(getLibrariesV1([libraryItem]));
        const { result } = renderHook(() =>
            useLibraryToggle({ datasetId: 2, redirectPath: "/" })
        );

        await waitFor(() => {
            expect(result.current.isInLibrary).toBe(false);
        });
    });

    it("adds the dataset when it is not in the library", async () => {
        const postSpy = jest
            .spyOn(apiService, "postRequest")
            .mockResolvedValue(1);
        server.use(getLibrariesV1([]));
        const { result } = renderHook(() => ({
            auth: useAuth(),
            library: useLibraryToggle({ datasetId: 2, redirectPath: "/" }),
        }));

        await waitFor(() => {
            expect(result.current.auth.isLoggedIn).toBe(true);
        });
        await act(() => result.current.library.toggleLibrary());

        expect(postSpy).toHaveBeenCalledWith(
            apis.librariesV1Url,
            expect.objectContaining({ dataset_id: 2 }),
            expect.anything()
        );
    });

    it("removes the dataset when it is in the library", async () => {
        const deleteSpy = jest
            .spyOn(apiService, "deleteRequest")
            .mockResolvedValue({});
        server.use(getLibrariesV1([libraryItem]));
        const { result } = renderHook(() =>
            useLibraryToggle({ datasetId: 1, redirectPath: "/" })
        );

        await waitFor(() => {
            expect(result.current.isInLibrary).toBe(true);
        });
        await act(() => result.current.toggleLibrary());

        expect(deleteSpy).toHaveBeenCalledWith(
            `${apis.librariesV1Url}/7`,
            expect.anything()
        );
    });
});
