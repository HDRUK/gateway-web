"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FileExport } from "@/interfaces/FileExport";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useSidebar from "@/hooks/useSidebar";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";
import GeneralEnquirySidebar from "../GeneralEnquirySidebar";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

const ActionBar = ({
    teamId,
    teamName,
    teamMemberOf,
}: {
    teamId: number;
    teamName: string;
    teamMemberOf: string;
}) => {
    const params = useParams<{
        datasetId: string;
    }>();

    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();

    const [isDownloading, setIsDownloading] = useState(false);

    const t = useTranslations(TRANSLATION_PATH);

    const { data: datasetCsv } = useGet<{
        content: string;
        filename: string;
        type: string;
    }>(`${apis.datasetsExportV1Url}/?dataset_id=${params?.datasetId}`, {
        shouldFetch: !isDownloading,
    });

    const handleDownload = async () => {
        const csvData = {
            ...datasetCsv,
            filename: `dataset_${params?.datasetId}.csv`,
        };

        if (csvData) {
            notificationService.apiSuccess(t("downloadStarted"));
            downloadFile(csvData as FileExport);
        }
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
                <Button
                    onClick={() => {
                        if (!isLoggedIn) {
                            showDialog(ProvidersDialog, {
                                isProvidersDialog: true,
                            });
                        } else {
                            showSidebar({
                                title: "Messages",
                                content: (
                                    <GeneralEnquirySidebar
                                        teamId={teamId}
                                        teamName={teamName}
                                        teamMemberOf={teamMemberOf}
                                    />
                                ),
                            });
                        }
                    }}>
                    {t("contact")}
                </Button>

                <Button variant="outlined" color="secondary" disabled>
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
