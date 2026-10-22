import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { FileExport } from "@/interfaces/FileExport";
import { Filter } from "@/interfaces/Filter";
import {
    SavedSearchPayload,
    SearchCategory,
    SearchQueryParams,
} from "@/interfaces/Search";
import FeasibilityEnquiryDialog from "@/modules/FeasibilityEnquiryDialog";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import ProvidersDialog from "@/modules/ProvidersDialog";
import SaveSearchDialog, {
    SaveSearchValues,
} from "@/modules/SaveSearchDialog.tsx";
import useAuth from "@/hooks/useAuth";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import usePostLoginAction from "@/hooks/usePostLoginAction";
import useSidebar from "@/hooks/useSidebar";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { PostLoginActions } from "@/consts/postLoginActions";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";
import { getSavedSearchPayload } from "@/utils/search";
import { getV1SearchBody } from "../utils/searchRequest";
import useAddLibraryModal from "./useAddLibraryModal";

const TRANSLATION_PATH = "pages.search";
const LIBRARIES_KEY = `${apis.librariesV1Url}?per_page=-1`;

interface UseSearchActionsParams {
    queryParams: SearchQueryParams;
    filters: Filter[];
    resultsView: string;
    redirectPath: string;
    isPending?: boolean;
}

const useSearchActions = ({
    queryParams,
    filters,
    resultsView,
    redirectPath,
    isPending = false,
}: UseSearchActionsParams) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { showDialog, hideDialog } = useDialog();
    const { showSidebar } = useSidebar();
    const { showDARApplicationModal } = useDataAccessRequest();
    const { mutate } = useSWRConfig();
    const [isDownloading, setIsDownloading] = useState(false);

    const mutateLibraries = () => mutate(LIBRARIES_KEY);

    const submitDownload = usePost(
        `${apis.searchV1Url}/${queryParams.type}?per_page=${queryParams.per_page}&page=${queryParams.page}&sort=${queryParams.sort}`,
        { successNotificationsOn: false }
    );

    const saveSearchQuery = usePost<SavedSearchPayload>(
        apis.saveSearchesV1Url,
        { itemName: "Saved search" }
    );

    const { showLibraryModal } = useAddLibraryModal({
        onSuccess: () =>
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.LIBRARY}`
            ),
        onContinue: () => mutateLibraries(),
    });

    const downloadSearchResults = async () => {
        setIsDownloading(true);

        const csvData = await submitDownload({
            ...getV1SearchBody(queryParams),
            download: true,
            download_type: resultsView,
        });

        if (csvData) {
            notificationService.apiSuccess(t("downloadStarted"));
            downloadFile({
                content: csvData,
                type: "text/csv",
                filename: `${queryParams.type || SearchCategory.DATASETS}.csv`,
            } as FileExport);
        }

        setIsDownloading(false);
    };

    const handleSaveSubmit = ({ name }: SaveSearchValues) => {
        saveSearchQuery(getSavedSearchPayload(filters, queryParams, name)).then(
            response => {
                if (response) hideDialog();
            }
        );
    };

    const showSaveSearchDialog = () =>
        showDialog(() => (
            <SaveSearchDialog
                onSubmit={handleSaveSubmit}
                onCancel={() => hideDialog()}
            />
        ));

    const handlePostLoginAction: Parameters<
        typeof usePostLoginAction
    >[0]["onAction"] = ({ action, data }) => {
        switch (action) {
            case PostLoginActions.SAVE_SEARCH:
                showSaveSearchDialog();
                break;

            case PostLoginActions.ADD_LIBRARY:
                showLibraryModal({ datasetId: data.datasetId });
                break;

            case PostLoginActions.OPEN_GENERAL_ENQUIRY:
                showSidebar({
                    title: "Messages",
                    content: (
                        <GeneralEnquirySidebar datasets={[data.dataset]} />
                    ),
                });
                break;

            case PostLoginActions.OPEN_FEASIBILITY_ENQUIRY:
                showDialog(FeasibilityEnquiryDialog, {
                    result: data.dataset,
                    mutateLibraries,
                });
                break;
            case PostLoginActions.START_DAR_REQUEST:
                showDARApplicationModal({
                    ...data,
                });
                break;
            default:
                console.warn(`Unhandled post login action: ${action}`);
                break;
        }
    };

    const { setPostLoginActionCookie } = usePostLoginAction({
        onAction: isPending ? undefined : handlePostLoginAction,
    });

    const handleSaveClick = () => {
        if (isLoggedIn) {
            showSaveSearchDialog();
        } else {
            setPostLoginActionCookie(PostLoginActions.SAVE_SEARCH);

            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath,
            });
        }
    };

    return {
        isDownloading,
        downloadSearchResults,
        handleSaveClick,
        showLibraryModal,
    };
};

export default useSearchActions;
