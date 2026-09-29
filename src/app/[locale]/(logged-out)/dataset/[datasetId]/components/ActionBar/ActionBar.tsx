"use client";

import { useState } from "react";
import { Button } from "@hdruk/ui";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { FileExport } from "@/interfaces/FileExport";
import Box from "@/components/Box";
import MenuDropdown from "@/components/MenuDropdown";
import useAuth from "@/hooks/useAuth";
import useDataAccessRequest from "@/hooks/useDataAccessRequest";
import useFeasibilityEnquiry from "@/hooks/useFeasibilityEnquiry";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import useLibraryToggle from "@/hooks/useLibraryToggle";
import getRequest from "@/services/api/get";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    ChevronThinIcon,
    DownloadIcon,
    QuestionAnswerIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { downloadFile } from "@/utils/download";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

interface ActionBarProps {
    dataset: Dataset;
}

const ActionBar = ({ dataset }: ActionBarProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { id: datasetId, name } = dataset;
    const path = usePathname();

    const { isLoggedIn } = useAuth();
    const showGeneralEnquiry = useGeneralEnquiry();
    const showFeasibilityEnquiry = useFeasibilityEnquiry();
    const { showDARApplicationModal } = useDataAccessRequest();

    const t = useTranslations(TRANSLATION_PATH);

    const { isInLibrary, toggleLibrary } = useLibraryToggle({
        datasetId,
        redirectPath: path,
    });

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

        const filename = `${datasetId}_${name}_${
            url ===
            `${apis.datasetsExportMetadataV1Url}/${datasetId}?download_type=structural`
                ? "Structural_Metadata"
                : url ===
                  `${apis.datasetsExportMetadataV1Url}/${datasetId}?download_type=metadata`
                ? "Metadata"
                : "Observations"
        }.csv`;

        const csvData = {
            content: datasetCsv,
            type: "text/csv; charset=UTF-8",
            filename,
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

        showDARApplicationModal({
            onGeneralEnquiryClick: handleGeneralEnquiryClick,
            onFeasibilityEnquiryClick: handleFeasibilityEnquiryClick,
            isDarEnabled: team.is_question_bank,
            hasPublishedDarTemplate: team.has_published_dar_template,
            teamName: team.name,
            modalHeader: team.dar_modal_header,
            modalContent: team.dar_modal_content,
            modalFooter: team.dar_modal_footer,
            url: `/${RouteName.DATASET_ITEM}/${datasetId}`,
            datasetIds: [datasetId],
            teamIds: [team.id],
            redirectPath: path,
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
                            `${apis.datasetsExportMetadataV1Url}/${datasetId}?download_type=metadata`
                        )
                    }
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    purpose="link">
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
                            `${apis.datasetsExportMetadataV1Url}/${datasetId}?download_type=observations`
                        )
                    }
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    purpose="link"
                    disabled={
                        dataset.versions[0].metadata?.metadata?.observations
                            ?.length === 0
                    }>
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
                            `${apis.datasetsExportMetadataV1Url}/${datasetId}?download_type=structural`
                        )
                    }
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    purpose="link"
                    disabled={
                        dataset.versions[0].metadata?.metadata
                            ?.structuralMetadata?.tables?.length === 0
                    }>
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
        <Box
            sx={{
                display: "grid",
                gap: 1,
                p: 0,
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "minmax(0, 1fr)",
                },
            }}>
            <Button onClick={handleStartDarRequest}>
                {t("submitApplication")}
            </Button>
            <Button onClick={handleGeneralEnquiryClick} purpose="secondary">
                <QuestionAnswerIcon
                    sx={{
                        pr: 1,
                        display: {
                            xs: "none",
                            sm: "inline-block",
                        },
                    }}
                />
                {t("generalEnquiryButtonText")}
            </Button>
            <Button onClick={handleFeasibilityEnquiryClick} purpose="secondary">
                <QuestionAnswerIcon
                    sx={{
                        pr: 1,
                        display: {
                            xs: "none",
                            sm: "inline-block",
                        },
                    }}
                />
                {t("feasibilityEnquiryButtonText")}
            </Button>
            <Button
                onClick={toggleLibrary}
                purpose="tertiary"
                startIcon={isInLibrary ? <Bookmark /> : <BookmarkBorder />}>
                {isInLibrary ? t("removeFromLibrary") : t("addToLibrary")}
            </Button>
            <Button
                aria-label={t("downloadMetadata")}
                purpose="tertiary"
                startIcon={
                    <DownloadIcon
                        sx={{
                            fill: "primary",
                        }}
                    />
                }
                endIcon={
                    <ChevronThinIcon
                        fontSize="medium"
                        style={{ color: "primary" }}
                        sx={{
                            display: {
                                xs: "none",
                                sm: "inline-block",
                            },
                        }}
                    />
                }
                onClick={handleOpenDropdownMenu}>
                {t("downloadMetadata")}
            </Button>
            <MenuDropdown
                handleClose={() => setAnchorElement(null)}
                menuItems={menuItems}
                anchorElement={anchorElement}
                title="downloads"
            />
        </Box>
    );
};

export default ActionBar;
