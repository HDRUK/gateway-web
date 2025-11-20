"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { FileExport } from "@/interfaces/FileExport";
import { SearchCategory } from "@/interfaces/Search";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DownloadIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataUse.components.ActionBar";

const ActionBar = () => {
    const router = useRouter();
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
        <Box sx={{ px: 3 }}>
            <ActionBarWrapper
                sx={{
                    flexDirection: { mobile: "column", tablet: "row" },
                    justifyContent: "space-between",
                    alignItems: { mobile: "flex-start", tablet: "stretch" },
                }}>
                <BackButton
                    label={t("label")}
                    style={{ margin: 0 }}
                    sx={{
                        paddingTop: { mobile: 1, tablet: 0 },
                        paddingLeft: { mobile: 1, tablet: 0 },
                    }}
                    onClick={() =>
                        router.push(
                            `/${RouteName.SEARCH}?type=${SearchCategory.DATA_USE}`
                        )
                    }
                />

                <Button
                    onClick={() => !isDownloading && downloadDataUse()}
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}>
                    {t("downloadDataUse")}
                </Button>
            </ActionBarWrapper>
        </Box>
    );
};

export default ActionBar;
