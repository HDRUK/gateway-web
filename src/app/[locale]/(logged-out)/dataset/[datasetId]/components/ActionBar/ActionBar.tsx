"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { FileExport } from "@/interfaces/FileExport";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import DarEnquiryDialog from "@/modules/DarEnquiryDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon, QuestionAnswerIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

interface ActionBarProps {
    dataset: Dataset;
}

const ActionBar = ({ dataset }: ActionBarProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { showDialog } = useDialog();
    const { id: datasetId } = dataset;
    const path = usePathname();

    const { isLoggedIn } = useAuth();
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();

    const t = useTranslations(TRANSLATION_PATH);

    const { team } = dataset;

    const result = {
        // this is a temp hack
        // these components were originally built for SearchDatasetResult.......
        // -- which is some weird combo of elastic and GWDM
        // - this might cause problems in the future too as our metadata is HDRUK not GWDM
        // - have to have something working for now....
        _id: dataset.id.toString(),
        team,
        metadata: dataset.versions[0].metadata.metadata,
    };

    const { data: datasetCsv } = useGet<{
        content: string;
        filename: string;
        type: string;
    }>(`${apis.datasetsExportV1Url}/?dataset_id=${datasetId}`, {
        shouldFetch: !isDownloading,
    });

    const handleDownload = async () => {
        const csvData = {
            ...datasetCsv,
            filename: `dataset_${datasetId}.csv`,
        };

        if (csvData) {
            notificationService.apiSuccess(t("downloadStarted"));
            downloadFile(csvData as FileExport);
        }
    };

    const handleFeasibilityEnquiryClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event?.stopPropagation();
        showFeasibilityEnquiry({
            dataset: result,
            isLoggedIn,
            redirectPath: path,
        });
    };

    const handleGeneralEnquiryClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event?.stopPropagation();
        showGeneralEnquiry({ dataset: result, isLoggedIn, redirectPath: path });
    };

    const handleStartDarRequest = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        showDialog(DarEnquiryDialog, {
            onGeneralEnquiryClick: handleGeneralEnquiryClick,
            onFeasibilityEnquiryClick: handleFeasibilityEnquiryClick,
            isDarEnabled: team.is_question_bank,
            url: `/${RouteName.DATASET_ITEM}/${datasetId}`,
        });
    };

    const downloadDataset = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    return (
        <ActionBarWrapper>
            <BackButton label={t("label")} style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button onClick={handleGeneralEnquiryClick}>
                    <QuestionAnswerIcon sx={{ pr: 1 }} />
                    {t("generalEnquiryButtonText")}
                </Button>
                <Button onClick={handleFeasibilityEnquiryClick}>
                    <QuestionAnswerIcon sx={{ pr: 1 }} />
                    {t("feasibilityEnquiryButtonText")}
                </Button>
                <Button
                    onClick={handleStartDarRequest}
                    variant="outlined"
                    color="secondary">
                    {t("submitApplication")}
                </Button>

                <Button
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}
                    onClick={() => !isDownloading && downloadDataset()}>
                    {t("downloadMetadata")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
