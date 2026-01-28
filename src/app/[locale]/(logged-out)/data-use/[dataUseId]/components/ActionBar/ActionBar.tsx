"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FileExport } from "@/interfaces/FileExport";
import { SearchCategory } from "@/interfaces/Search";
import Button from "@/components/Button";
import HeaderActionBar from "@/components/HeaderActionBar";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";

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
        if (!dur_content) return;

        const csvData: FileExport = {
            ...dur_content,
            filename: `dur_${params.dataUseId}.csv`,
        };

        notificationService.apiSuccess(t("downloadStarted"));
        downloadFile(csvData);
    };

    const downloadDataUse = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    return (
        <HeaderActionBar
            backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.DATA_USE}`}
            backButtonText={t("label")}
            additionalContent={
                <Button
                    onClick={() => !isDownloading && downloadDataUse()}
                    sx={{ p: 0 }}
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}>
                    {t("downloadDataUse")}
                </Button>
            }
        />
    );
};

export default ActionBar;
