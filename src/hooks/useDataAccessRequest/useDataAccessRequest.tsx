import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DarEnquiryDialog from "@/modules/DarEnquiryDialog";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DarApplicationStatus } from "@/consts/dataAccess";
import { RouteName } from "@/consts/routeName";
import { formatDate, getToday } from "@/utils/date";
import useAuth from "../useAuth";
import usePost from "../usePost";

export interface CreateDARApplicationProps {
    redirectPath?: string | null;
    datasetIds: number[];
    teamIds: number[];
}

interface ShowDARApplicationModalProps {
    onGeneralEnquiryClick(event: React.MouseEvent<HTMLButtonElement>): void;
    onFeasibilityEnquiryClick(event: React.MouseEvent<HTMLButtonElement>): void;
    isDarEnabled: boolean;
    url: string;
    modalHeader: string | null;
    modalContent: string | null;
    datasetIds: number[];
    teamIds: number[];
    redirectPath?: string | null;
}

const TRANSLATION_PATH = "hooks.UseDataAccessRequest";

const DATE_FORMAT_TITLE = "DD/MM/YY HH:mm";

const useDataAccessRequest = () => {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const createNewDARApplication = usePost(apis.dataAccessApplicationV1Url, {
        successNotificationsOn: false,
        errorNotificationsOn: false,
    });

    const createDARApplication = useCallback(
        ({
            datasetIds,
            teamIds,
            redirectPath = "/",
        }: CreateDARApplicationProps) => {
            if (!isLoggedIn) {
                return showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath,
                });
            }

            return createNewDARApplication({
                dataset_ids: datasetIds,
                team_ids: teamIds,
                project_title: `${DarApplicationStatus.DRAFT} ${formatDate(
                    getToday(),
                    DATE_FORMAT_TITLE
                )}`,
            })
                .then(res => {
                    if (!res) {
                        throw new Error(t("failedToCreate"));
                    }

                    const applicationId = res;
                    const redirectUrl = `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}/${applicationId}`;
                    router.push(redirectUrl);
                })
                .catch(() => {
                    notificationService.apiError(t("failedToCreate"));
                });
        },
        [createNewDARApplication, isLoggedIn, router, showDialog, t]
    );

    const showDARApplicationModal = useCallback(
        ({
            onGeneralEnquiryClick,
            onFeasibilityEnquiryClick,
            isDarEnabled,
            modalHeader,
            modalContent,
            url,
            datasetIds,
            teamIds,
            redirectPath,
        }: ShowDARApplicationModalProps) => {
            if (!isLoggedIn) {
                return showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath,
                });
            }

            if (isDarEnabled && !modalContent) {
                return createDARApplication({
                    datasetIds,
                    teamIds,
                    redirectPath,
                });
            }

            return showDialog(DarEnquiryDialog, {
                onGeneralEnquiryClick,
                onFeasibilityEnquiryClick,
                isDarEnabled,
                modalHeader,
                modalContent,
                url,
                datasetIds,
                teamIds,
                redirectPath,
                createDARApplication,
            });
        },
        [createDARApplication, isLoggedIn, showDialog]
    );

    return {
        createDARApplication,
        showDARApplicationModal,
    };
};

export default useDataAccessRequest;
