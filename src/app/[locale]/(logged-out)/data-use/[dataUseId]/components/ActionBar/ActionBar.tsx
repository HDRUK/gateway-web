"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FileExport } from "@/interfaces/FileExport";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataUse.components.ActionBar";

const ActionBar = () => {
    const params = useParams<{
        dataUseId: string;
    }>();

    const [isDownloading, setIsDownloading] = useState(false);

    const t = useTranslations(TRANSLATION_PATH);

    const { data: dur_content } = useGet<object>(
        `${apis.dataUseExportV1Url}/?dur_id=${params.dataUseId}`
    );

    const handleDownload = async () => {
        const csvData = dur_content;
        console.log('csvData', csvData);
        console.log('isDownloading', isDownloading);
        if (csvData) {
            csvData.filename = `dur_${params.dataUseId}.csv`;
            notificationService.apiSuccess(t("downloadStarted"));
            downloadFile(csvData as FileExport);
        }
    };

    const downloadDataUse = async () => {
        setIsDownloading(true);
        console.log('isDownloading2', isDownloading);
        await handleDownload();
        console.log('isDownloading3', isDownloading);
        setIsDownloading(false);
        console.log('isDownloading4', isDownloading);

    };

    return (
        <ActionBarWrapper>
            <BackButton label={t("label")} style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button
                    onClick={() => !isDownloading && downloadDataUse()}
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}>
                    {t("downloadDataUse")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
