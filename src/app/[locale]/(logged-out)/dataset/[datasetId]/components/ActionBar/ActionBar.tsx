"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { CsvExport } from "@/interfaces/CsvExport";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon } from "@/consts/icons";
import { downloadCSV } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

const ActionBar = () => {
    const params = useParams<{
        datasetId: string;
    }>();

    const [isDownloading, setIsDownloading] = useState(false);

    const t = useTranslations(TRANSLATION_PATH);

    const { data: datasetCsv } = useGet<{
        content: string;
        filename: string;
        type: string;
    }>(`${apis.datasetsExportV1Url}/?dataset_id=${params?.datasetId}`, {
        shouldFetch: isDownloading,
    });

    const handleDownload = async () => {
        const csvData = {
            ...datasetCsv,
            filename: `dataset_${params?.datasetId}.csv`,
        };

        if (csvData) {
            notificationService.apiSuccess(t("downloadStarted"));
            downloadCSV(csvData as CsvExport);
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
                <Button disabled>{t("contact")}</Button>

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
