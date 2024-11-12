"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { FileExport } from "@/interfaces/FileExport";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import MenuDropdown from "@/components/MenuDropdown";
import DarEnquiryDialog from "@/modules/DarEnquiryDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import getRequest from "@/services/api/get";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { DownloadIcon, QuestionAnswerIcon } from "@/consts/icons";
import { ChevronThinIcon } from "@/consts/icons";
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

    const handleDownload = async (url: string) => {
        console.log("isDownloading in handleDownload()", isDownloading);

        const { content: datasetCsv } = await getRequest<{
            content: string;
            filename: string;
            type: string;
        }>(url, {
            withPagination: false,
            notificationOptions: {
                localeKey: "1",
                itemName: "1",
                errorNotificationsOn: true,
                t,
                action: 1,
            },
        });

        const filename2 = `dataset_${datasetId}_${
            url ===
            `${apis.datasetsExportV1Url}_single/${datasetId}?download_type=structural`
                ? "structuralMetadata"
                : "other"
        }.csv`;

        const csvData = {
            content: datasetCsv,
            type: "text/csv; charset=UTF-8",
            filename: filename2,
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

    const downloadDataset = async (url: string) => {
        setIsDownloading(true);
        const result = await handleDownload(url);
        setIsDownloading(false);
        return result;
    };

    const menuItems = [
        {
            label: "Metadata",
            button: (
                <Button
                    onClick={() =>
                        !isDownloading &&
                        downloadDataset(
                            `${apis.datasetsExportV1Url}_single/${datasetId}?download_type=metadata`
                        )
                    }
                    variant="link">
                    Metadata
                </Button>
            ),
        },
        {
            label: "Observations",
            button: (
                <Button
                    onClick={() =>
                        !isDownloading &&
                        downloadDataset(
                            `${apis.datasetsExportV1Url}_single/${datasetId}?download_type=observations`
                        )
                    }
                    variant="link">
                    Observations
                </Button>
            ),
        },
        {
            label: "Structural Metadata",
            button: (
                <Button
                    onClick={() =>
                        !isDownloading &&
                        downloadDataset(
                            `${apis.datasetsExportV1Url}_single/${datasetId}?download_type=structural`
                        )
                    }
                    variant="link">
                    Structural Metadata
                </Button>
            ),
        },
    ];

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const handleOpenDropdownMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorElement(event.currentTarget);
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
                    aria-label={t("downloadMetadata")}
                    variant="text"
                    startIcon={<DownloadIcon sx={{ fill: "primary" }} />}
                    endIcon={
                        <ChevronThinIcon
                            fontSize="medium"
                            style={{ color: "primary" }}
                        />
                    }
                    sx={{ ml: 2, bgcolor: colors.grey200 }}
                    onClick={handleOpenDropdownMenu}>
                    {t("downloadMetadata")}
                </Button>
                <MenuDropdown
                    handleClose={() => setAnchorElement(null)}
                    menuItems={menuItems}
                    anchorElement={anchorElement}
                    title={"downloads"}
                    stopPropagation
                />
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
