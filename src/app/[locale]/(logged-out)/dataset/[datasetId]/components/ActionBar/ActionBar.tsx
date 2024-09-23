"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import { FileExport } from "@/interfaces/FileExport";
import { Team } from "@/interfaces/Team";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import DarEnquiryDialog from "@/modules/DarEnquiryDialog";
import FeasibilityEnquirySidebar from "@/modules/FeasibilityEnquirySidebar";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useSidebar from "@/hooks/useSidebar";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon, QuestionAnswerIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";
const TRANSLATION_PATH_SIDEBAR =
    "pages.account.profile.library.components.RightPanel";

interface ActionBarProps {
    dataset: Dataset;
    team: Team;
}

const ActionBar = ({ dataset, team }: ActionBarProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();
    const { id: datasetId } = dataset;

    const t = useTranslations(TRANSLATION_PATH);
    const tSidebar = useTranslations(TRANSLATION_PATH_SIDEBAR);

    const datasetsEnquiry = [
        {
            datasetId: dataset.id,
            teamId: team.id,
            teamName: team.name,
            teamMemberOf: team.member_of,
        },
    ];

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

    const handleFeasibilityEnquiryClick = () => {
        showSidebar({
            title: tSidebar("feasibilityEnquiries.sidebarTitle"),
            content: <FeasibilityEnquirySidebar datasets={datasetsEnquiry} />,
        });
    };

    const handleGeneralEnquiryClick = () => {
        showSidebar({
            title: tSidebar("generalEnquiries.sidebarTitle"),
            content: <GeneralEnquirySidebar datasets={datasetsEnquiry} />,
        });
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
