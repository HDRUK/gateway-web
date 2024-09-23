"use client";

import {
    ReactElement,
    JSXElementConstructor,
    ReactFragment,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { colors } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { range } from "lodash";
import { useTranslations } from "next-intl";
import { StructuralMetadata } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import DownloadFile from "@/components/DownloadFile";
import Paper from "@/components/Paper";
import StructuralMetadataAccordion from "@/components/StructuralMetadataAccordion";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import apis from "@/config/apis";
import { colors as themeColors } from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { capitalise, splitCamelcase } from "@/utils/general";

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset.structuralMetadata`;

interface StructuralMetadataProps {
    selectedFormSection: string;
    structuralMetadata?: StructuralMetadata[];
    fileProcessedAction: (metadata: StructuralMetadata[]) => void;
    handleToggleUploading: (isUploading: boolean) => void;
}

const columnHelper = createColumnHelper();

const renderTextWrapper = (
    text:
        | ReactElement<string, string | JSXElementConstructor<string>>
        | ReactFragment
) => <Typography>{text}</Typography>;

const renderBoldText = (chunks: ReactNode) => (
    <>
        <br />
        <b>{chunks}</b>
    </>
);

const renderRedText = (chunks: ReactNode) => (
    <span
        style={{
            color: `${themeColors.red600}`,
            fontWeight: "bold",
        }}>
        {chunks}
    </span>
);

const renderTableHeader = (headerText: string) => (
    <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>
        {headerText}
    </Typography>
);

const StructuralMetadataSection = ({
    selectedFormSection,
    structuralMetadata,
    fileProcessedAction,
    handleToggleUploading,
}: StructuralMetadataProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const tableColumns = [
        {
            header: t("metadataFieldHeader"),
            path: "metadataField",
        },
        {
            header: t("completionGuidanceHeader"),
            path: "completionGuidance",
        },
    ];

    const getColumns = () =>
        tableColumns.map(column =>
            columnHelper.display({
                id: column.header,
                cell: ({ row: { index } }) =>
                    renderTextWrapper(
                        t.rich(`${column.path}${index + 1}`, {
                            bold: chunks => renderBoldText(chunks),
                            red: chunks => renderRedText(chunks),
                        })
                    ),
                header: () => renderTableHeader(column.header),
                size: column.path === "metadataField" ? 70 : 150,
            })
        );

    useEffect(() => {
        handleToggleUploading(isUploading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    return (
        <Paper
            sx={{
                marginTop: 1.25,
                marginBottom: 1.25,
                padding: 2,
            }}>
            <Typography variant="h2">
                {capitalise(splitCamelcase(selectedFormSection))}
            </Typography>

            <Box sx={{ p: 0, mb: 3 }}>
                <Typography sx={{ mb: 2 }}>{t("intro")}</Typography>
                <Table columns={getColumns()} rows={range(0, 6)} />
            </Box>

            <DownloadFile
                buttonText={t("downloadTemplate")}
                apiPath={apis.structuralMetadataExportV1Url}
            />

            <Box sx={{ p: 0, mb: 3 }}>
                <Typography
                    sx={{
                        color: colors.brown[500],
                        backgroundColor: colors.yellow[100],
                        p: 2,
                        mt: 1,
                        border: `1px solid ${colors.brown[500]}`,
                        fontWeight: 500,
                    }}>
                    {t("uploadSuccess")}
                </Typography>
            </Box>

            <UploadFile
                apiPath={`${apis.fileUploadV1Url}?entity_flag=structural-metadata-upload`}
                onFileUploaded={metadata =>
                    fileProcessedAction(metadata as StructuralMetadata[])
                }
                isUploading={setIsUploading}
                allowReuploading
            />

            {isUploading && (
                <Typography sx={{ mt: 2 }}>{t("uploadMessage")}</Typography>
            )}

            {structuralMetadata && !isUploading && (
                <Box sx={{ mt: 4, p: 0 }}>
                    <StructuralMetadataAccordion
                        metadata={structuralMetadata}
                    />
                </Box>
            )}
        </Paper>
    );
};

export default StructuralMetadataSection;
