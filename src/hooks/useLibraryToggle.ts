import { KeyedMutator } from "swr";
import { Library, NewLibrary } from "@/interfaces/Library";
import ProvidersDialog from "@/modules/ProvidersDialog";
import apis from "@/config/apis";
import { PostLoginActions } from "@/consts/postLoginActions";
import useAuth from "./useAuth";
import useDelete from "./useDelete";
import useDialog from "./useDialog";
import useGet from "./useGet";
import usePost from "./usePost";
import usePostLoginAction from "./usePostLoginAction";

interface UseLibraryToggleProps {
    datasetId: number;
    redirectPath: string;
    handlePostLoginAction?: boolean;
}

const useLibraryToggle = ({
    datasetId,
    redirectPath,
    handlePostLoginAction = true,
}: UseLibraryToggleProps) => {
    const { isLoggedIn, user } = useAuth();
    const { showDialog } = useDialog();

    const { data: libraryData, mutate: mutateLibraries } = useGet<Library[]>(
        `${apis.librariesV1Url}?per_page=-1`,
        { shouldFetch: isLoggedIn }
    );

    const libraryItem = libraryData?.find(
        item => item.dataset_id === datasetId
    );

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        localeKey: "updateYourLibrary",
    });

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        localeKey: "updateYourLibrary",
    });

    const addToLibrary = () => {
        if (!user) return;

        addLibrary({ user_id: user.id, dataset_id: datasetId }).then(() =>
            mutateLibraries()
        );
    };

    const { setPostLoginActionCookie } = usePostLoginAction({
        onAction: handlePostLoginAction
            ? ({ action, data }) => {
                  if (
                      action === PostLoginActions.ADD_LIBRARY &&
                      data.datasetId === datasetId
                  ) {
                      addToLibrary();
                  }
              }
            : undefined,
    });

    const toggleLibrary = async () => {
        if (!isLoggedIn) {
            setPostLoginActionCookie(PostLoginActions.ADD_LIBRARY, {
                datasetId,
            });
            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath,
            });
            return;
        }

        if (libraryItem) {
            await deleteLibrary(libraryItem.id);
            mutateLibraries();
        } else {
            addToLibrary();
        }
    };

    return {
        isInLibrary: !!libraryItem,
        toggleLibrary,
        mutateLibraries: mutateLibraries as KeyedMutator<Library[]>,
    };
};

export default useLibraryToggle;
